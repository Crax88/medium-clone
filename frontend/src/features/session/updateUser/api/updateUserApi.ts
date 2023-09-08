import { baseApi, SESSION_TAG } from 'shared/api';
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
			invalidatesTags: [SESSION_TAG],
			async onQueryStarted(profile, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled;
					dispatch(updateUser(profile));
				} catch (error) {
					console.error(error);
				}
			},
		}),
	}),
});

export const { useUpdateUserMutation } = sessionApi;
