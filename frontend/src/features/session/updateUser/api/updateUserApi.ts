import {
	baseApi,
	SESSION_TAG,
	ARTICLE_TAG,
	PROFILE_TAG,
	TAG_TAG,
} from 'shared/api';
import { UpdateProfileDto } from './types';
import { updateUser } from 'entities/session';

export const sessionApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		updateUser: builder.mutation<void, UpdateProfileDto>({
			query: (credentials) => ({
				url: `/user`,
				method: 'PUT',
				body: { user: credentials },
			}),
			invalidatesTags: [SESSION_TAG, ARTICLE_TAG, PROFILE_TAG, TAG_TAG],
			async onQueryStarted(profile, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(updateUser(profile));
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error(error);
				}
			},
		}),
	}),
});

export const { useUpdateUserMutation } = sessionApi;
