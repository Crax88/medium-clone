import { TagDescription } from '@reduxjs/toolkit/query';
import { baseApi, PROFILE_TAG } from 'shared/api';
import { type TProfile } from '../model/types';
import { type TProfileRequestDto, type TResponseReponseDto } from './types';

type initialState = TProfile | null;

export const profileApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<initialState, TProfileRequestDto>({
			query: ({ username }) => ({
				url: `/profiles/${encodeURIComponent(username)}`,
			}),
			transformResponse: (responseData: TResponseReponseDto) => {
				return responseData.profile;
			},
			providesTags: (result) => {
				const tags: TagDescription<typeof PROFILE_TAG>[] = [
					{ type: PROFILE_TAG, id: 'LIST' },
				];

				tags.push({
					type: PROFILE_TAG,
					id: result?.username,
				});

				return tags;
			},
		}),
	}),
});

export const { useGetProfileQuery } = profileApi;
