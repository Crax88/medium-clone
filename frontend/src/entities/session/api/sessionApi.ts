import { baseApi, SESSION_TAG } from 'shared/api';
import { mapSession } from '../lib/mapSession';
import { type Session } from '../model/types';
import {
	type RequestLoginDto,
	type RequestRegisterDto,
	type SessionDto,
} from './types';

export const sessionApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<Session, RequestLoginDto>({
			query: (credentials) => ({
				url: `/users/login`,
				method: 'POST',
				body: { user: credentials },
			}),
			invalidatesTags: [SESSION_TAG],
			transformResponse: (response: SessionDto) => mapSession(response),
		}),
		register: builder.mutation<Session, RequestRegisterDto>({
			query: (credentials) => ({
				url: `/users`,
				method: 'POST',
				body: { user: credentials },
			}),
			invalidatesTags: [SESSION_TAG],
			transformResponse: (response: SessionDto) => mapSession(response),
		}),
		// me: build.query<User, void>({
		// 	query: () => ({
		// 		url: `/me`,
		// 	}),
		// 	providesTags: [SESSION_TAG],
		// 	transformResponse: (response: UserDto) => mapUser(response),
		// }),
	}),
});

export const { useLoginMutation, useRegisterMutation } = sessionApi;
