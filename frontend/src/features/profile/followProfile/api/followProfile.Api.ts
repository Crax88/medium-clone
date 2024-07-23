import { baseApi } from 'shared/api';
import { config } from 'shared/lib';
import { TFollowProfileRequestDto, TFollowProfileResponseDto } from './types';
import { profileApi } from 'entities/profile';
import { articlesApi } from 'entities/article';
import { ARTICLE_TAG } from 'shared/api';
import { PatchCollection } from '@reduxjs/toolkit/dist/query/core/buildThunks';

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
			async onQueryStarted(
				{ username },
				{ dispatch, queryFulfilled, getState },
			) {
				const patchResult: PatchCollection[] = [];
				patchResult.push(
					dispatch(
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
					),
				);
				for (const {
					endpointName,
					originalArgs,
				} of articlesApi.util.selectInvalidatedBy(getState(), [
					{ type: ARTICLE_TAG },
				])) {
					if (endpointName === 'getArticle') {
						patchResult.push(
							dispatch(
								articlesApi.util.updateQueryData(
									'getArticle',
									originalArgs,
									(draft) => {
										if (draft && draft.author.username === username) {
											draft.author.following = true;
										}
									},
								),
							),
						);
					}
				}
				try {
					await queryFulfilled;
				} catch (error) {
					if (patchResult.length) {
						patchResult.forEach((patch) => {
							patch.undo();
						});
					}
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
			async onQueryStarted(
				{ username },
				{ dispatch, queryFulfilled, getState },
			) {
				const patchResult: PatchCollection[] = [];
				patchResult.push(
					dispatch(
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
					),
				);

				for (const {
					endpointName,
					originalArgs,
				} of articlesApi.util.selectInvalidatedBy(getState(), [
					{ type: ARTICLE_TAG },
				])) {
					if (endpointName === 'getArticle') {
						patchResult.push(
							dispatch(
								articlesApi.util.updateQueryData(
									'getArticle',
									originalArgs,
									(draft) => {
										if (draft && draft.author.username === username) {
											draft.author.following = false;
										}
									},
								),
							),
						);
					}
				}
				try {
					await queryFulfilled;
				} catch (error) {
					if (patchResult.length) {
						patchResult.forEach((patch) => {
							patch.undo();
						});
					}
				}
			},
		}),
	}),
});

export const { useFollowProfileMutation, useUnfollowProfileMutation } =
	followApi;
