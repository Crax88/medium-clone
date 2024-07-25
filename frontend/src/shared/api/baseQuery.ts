import { type BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	type FetchArgs,
	type FetchBaseQueryError,
	type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { config } from '../lib';
import { SessionDto } from 'entities/session/api/types';

export const baseQuery: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError,
	Record<string, unknown>,
	FetchBaseQueryMeta
> = fetchBaseQuery({
	baseUrl: config.apiUrl,
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const { acccessToken } = (getState() as RootState).session;

		if (acccessToken) {
			headers.set('Authorization', `Token ${acccessToken}`);
		}

		return headers;
	},
});

export const baseQueryWithReAuth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError,
	Record<string, unknown>,
	FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);
	if (result.error && result.error.status === 401) {
		// try to get a new token
		const refreshResult = await baseQuery('/users/refresh', api, extraOptions);

		if (refreshResult.data) {
			const {
				user: { token, ...userFields },
			} = refreshResult.data as SessionDto;

			api.dispatch({
				type: 'session/setAuth',
				payload: {
					user: userFields,
					acccessToken: token,
				},
			});
			// retry the initial query
			result = await baseQuery(args, api, extraOptions);
		} else {
			// api.dispatch(clearSession());
		}
	}
	return result;
};
