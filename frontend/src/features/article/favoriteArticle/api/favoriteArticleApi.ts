import { baseApi } from 'shared/api';
import { config } from 'shared/lib';
import { TFavoriteArticleResponseDto, TFavoriteRequestDto } from './types';
import { articlesApi } from 'entities/article';
import { PatchCollection } from '@reduxjs/toolkit/dist/query/core/buildThunks';

export const favoriteApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		favoriteArticle: builder.mutation<
			TFavoriteArticleResponseDto,
			TFavoriteRequestDto
		>({
			query: ({ slug }) => ({
				url: `${config.apiUrl}/articles/${slug}/favorite`,
				method: 'POST',
			}),
			async onQueryStarted({ slug }, { dispatch, queryFulfilled, getState }) {
				const patchResult: PatchCollection[] = [];
				for (const {
					endpointName,
					originalArgs,
				} of articlesApi.util.selectInvalidatedBy(getState(), [
					{ type: 'ARTICLE_TAG' },
				])) {
					if (endpointName === 'getArticles') {
						patchResult.push(
							dispatch(
								articlesApi.util.updateQueryData(
									'getArticles',
									originalArgs,
									(draft) => {
										const article = draft.articles.find(
											(article) => article.slug === slug,
										);
										if (article) {
											article.favorited = true;
											article.favoritesCount = article.favoritesCount + 1;
										}
									},
								),
							),
						);
					}
					if (endpointName === 'getArticle') {
						patchResult.push(
							dispatch(
								articlesApi.util.updateQueryData(
									'getArticle',
									originalArgs,
									(draft) => {
										if (draft) {
											draft.favorited = true;
											draft.favoritesCount = draft.favoritesCount + 1;
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
		unfavoriteArticle: builder.mutation<
			TFavoriteArticleResponseDto,
			TFavoriteRequestDto
		>({
			query: ({ slug }) => ({
				url: `${config.apiUrl}/articles/${slug}/favorite`,
				method: 'DELETE',
			}),
			async onQueryStarted({ slug }, { dispatch, queryFulfilled, getState }) {
				const patchResult: PatchCollection[] = [];
				for (const {
					endpointName,
					originalArgs,
				} of articlesApi.util.selectInvalidatedBy(getState(), [
					{ type: 'ARTICLE_TAG' },
				])) {
					if (endpointName === 'getArticles') {
						patchResult.push(
							dispatch(
								articlesApi.util.updateQueryData(
									'getArticles',
									originalArgs,
									(draft) => {
										const article = draft.articles.find(
											(article) => article.slug === slug,
										);
										if (article) {
											article.favorited = false;
											article.favoritesCount = article.favoritesCount - 1;
										}
									},
								),
							),
						);
					}

					if (endpointName === 'getArticle') {
						patchResult.push(
							dispatch(
								articlesApi.util.updateQueryData(
									'getArticle',
									originalArgs,
									(draft) => {
										if (draft) {
											draft.favorited = false;
											draft.favoritesCount = draft.favoritesCount - 1;
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
			// invalidatesTags: (result, err, arg) => {
			// 	return [{ type: ARTICLE_TAG, id: arg.slug }];
			// },
		}),
	}),
});

export const { useFavoriteArticleMutation, useUnfavoriteArticleMutation } =
	favoriteApi;
