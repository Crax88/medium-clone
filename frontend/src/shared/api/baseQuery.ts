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
	prepareHeaders: (headers) => {
		headers.set(
			'Authorization',
			// eslint-disable-next-line max-len
			'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoidGVzdGNyYXhAZ21haWwuY29tIiwidXNlcm5hbWUiOiJUZXN0Q3JheCJ9LCJpYXQiOjE2OTA5NzAxNzEsImV4cCI6MTY5NjE1NDE3MX0.fG-vjDgJX4AG2-03VhYbWPlRkNEx1p2qMgE5XZFSc5M',
		);
		// const { accessToken } = (getState() as RootState).session;

		// if (accessToken) {
		// 	headers.set('Authorization', `Bearer ${accessToken}`);
		// }

		return headers;
	},
});
