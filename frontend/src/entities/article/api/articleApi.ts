import { TagDescription } from '@reduxjs/toolkit/query';
import { baseApi, ARTICLE_TAG } from 'shared/api';
import { config } from 'shared/lib';
import { type TArticle } from '../model/types';
import {
	type TArticlesRequestDto,
	type TArticlesReponseDto,
	type TArticleRequestDto,
	type TArticleResponseDto,
	TArticleCreateDto,
} from './types';

// const articlesAdapter = createEntityAdapter<TArticle>({ selectId: (article) => article.slug });

// const initialState = articlesAdapter.getInitialState<{
// 	articlesCount: number;
// }>({
// 	articlesCount: 0,
// });

type initialState = {
	articles: TArticle[];
	articlesCount: number;
};

export const articlesApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getArticles: builder.query<initialState, TArticlesRequestDto>({
			query: ({
				author,
				favorited,
				tag,
				offset = 0,
				limit = config.pageSize,
				isFeed,
			}) => ({
				url: `/articles${isFeed ? '/feed' : ''}`,
				params: {
					author,
					favorited,
					tag,
					offset,
					limit,
				},
			}),
			transformResponse: (responseData: TArticlesReponseDto) => {
				return responseData;
			},
			providesTags: (result) => {
				const tags: TagDescription<typeof ARTICLE_TAG>[] = [
					{ type: ARTICLE_TAG, id: 'LIST' },
				];
				result?.articles?.map(({ slug }) => {
					tags.push({
						type: ARTICLE_TAG,
						id: slug,
					});
				});
				return tags;
			},
		}),
		getArticle: builder.query<TArticle, TArticleRequestDto>({
			query: ({ slug }) => `/articles/${slug}`,
			transformResponse: (responseData: TArticleResponseDto) => {
				return responseData.article;
			},
			providesTags: (_, __, arg) => {
				const tags: TagDescription<typeof ARTICLE_TAG>[] = [
					{ type: ARTICLE_TAG, id: arg.slug },
				];
				return tags;
			},
		}),
		deleteArticle: builder.mutation<void, TArticleRequestDto>({
			query: ({ slug }) => ({
				url: `${config.apiUrl}/articles/${slug}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: ARTICLE_TAG, id: 'LIST' }],
		}),
		createArticle: builder.mutation<TArticle, TArticleCreateDto>({
			query: (values) => ({
				url: `${config.apiUrl}/articles`,
				method: 'POST',
				body: { article: values },
			}),
			transformResponse: (responseData: TArticleResponseDto) => {
				return responseData.article;
			},
			invalidatesTags: [{ type: ARTICLE_TAG, id: 'LIST' }],
		}),
		updateArticle: builder.mutation<
			TArticle,
			{
				slug: TArticle['slug'];
				values: TArticleCreateDto;
			}
		>({
			query: (data) => ({
				url: `${config.apiUrl}/articles/${data.slug}`,
				method: 'PUT',
				body: { article: data.values },
			}),
			transformResponse: (responseData: TArticleResponseDto) => {
				return responseData.article;
			},
			invalidatesTags: (result, err, arg) => {
				return [
					{ type: ARTICLE_TAG, id: 'LIST' },
					{ type: ARTICLE_TAG, id: arg.slug },
				];
			},
		}),
	}),
});

export const {
	useGetArticlesQuery,
	useGetArticleQuery,
	useDeleteArticleMutation,
	useCreateArticleMutation,
	useUpdateArticleMutation,
} = articlesApi;
