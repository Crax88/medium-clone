import { type BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	type FetchArgs,
	type FetchBaseQueryError,
	type FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { config } from '../lib';

export const baseQuery: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError,
	Record<string, unknown>,
	FetchBaseQueryMeta
> = fetchBaseQuery({
	baseUrl: config.apiUrl,
	// credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const { acccessToken } = (getState() as RootState).session;

		if (acccessToken) {
			headers.set('Authorization', `Token ${acccessToken}`);
		}

		return headers;
	},
});
