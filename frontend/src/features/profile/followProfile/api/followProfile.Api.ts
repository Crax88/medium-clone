import { baseApi } from 'shared/api';
import { config } from 'shared/lib';
import { TFollowProfileRequestDto, TFollowProfileResponseDto } from './types';
import { profileApi } from 'entities/profile';

export const followApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		followProfile: builder.mutation<
			TFollowProfileResponseDto,
			TFollowProfileRequestDto
		>({
			query: ({ username }) => ({
				url: `${config.apiUrl}/profiles/${username}/follow`,
				method: 'POST',
			}),
			async onQueryStarted({ username }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					profileApi.util.updateQueryData(
						'getProfile',
						{ username },
						(draft) => {
							const profile = draft;
							if (profile) {
								profile.following = true;
							}
						},
					),
				);
				try {
					await queryFulfilled;
				} catch (error) {
					patchResult.undo();
				}
			},
		}),
		unfollowProfile: builder.mutation<
			TFollowProfileResponseDto,
			TFollowProfileRequestDto
		>({
			query: ({ username }) => ({
				url: `${config.apiUrl}/profiles/${username}/follow`,
				method: 'DELETE',
			}),
			async onQueryStarted({ username }, { dispatch, queryFulfilled }) {
				const patchResult = dispatch(
					profileApi.util.updateQueryData(
						'getProfile',
						{ username },
						(draft) => {
							const profile = draft;
							if (profile) {
								profile.following = false;
							}
						},
					),
				);
				try {
					await queryFulfilled;
				} catch (error) {
					patchResult.undo();
				}
			},
		}),
	}),
});

export const { useFollowProfileMutation, useUnfollowProfileMutation } =
	followApi;
