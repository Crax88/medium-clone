import { TagDescription } from '@reduxjs/toolkit/query';
import { baseApi, COMMENT_TAG } from 'shared/api';
import { type TComment } from '../model/types';
import {
	type TCommentCreateDto,
	type TCommentCreateResponseDto,
	type TCommentDeleteDto,
	type TCommentsRequestDto,
	type TCommentsResponseDto,
} from './types';

type initialState = {
	comments: TComment[];
};

export const commentApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getComments: builder.query<initialState, TCommentsRequestDto>({
			query: ({ slug }) => ({
				url: `/articles/${slug}/comments`,
			}),
			transformResponse: (responseData: TCommentsResponseDto) => {
				return responseData;
			},
			providesTags: (result) => {
				const tags: TagDescription<typeof COMMENT_TAG>[] = [
					{ type: COMMENT_TAG, id: 'LIST' },
				];
				result?.comments?.map(({ id }) => {
					tags.push({
						type: COMMENT_TAG,
						id,
					});
				});
				return tags;
			},
		}),
		deleteComment: builder.mutation<void, TCommentDeleteDto>({
			query: ({ slug, id }) => ({
				url: `/articles/${slug}/comments/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: COMMENT_TAG, id: 'LIST' }],
		}),
		createComment: builder.mutation<TComment, TCommentCreateDto>({
			query: ({ body, slug }) => ({
				url: `/articles/${slug}/comments`,
				method: 'POST',
				body: { comment: { body } },
			}),
			transformResponse: (responseData: TCommentCreateResponseDto) => {
				return responseData.comment;
			},
			invalidatesTags: [{ type: COMMENT_TAG, id: 'LIST' }],
		}),
	}),
});

export const {
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
} = commentApi;
