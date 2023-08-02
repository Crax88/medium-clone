import { createEntityAdapter } from '@reduxjs/toolkit';
import { TagDescription } from '@reduxjs/toolkit/query';
import { baseApi, TAG_TAG } from 'shared/api';
import { type TTag } from '../model/types';
import { type TTagsReponse } from './types';

const tagsAdapter = createEntityAdapter<TTag>({
	selectId: (tag) => tag,
});

const initialState = tagsAdapter.getInitialState();

export const tagsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPopularTags: builder.query<typeof initialState, void>({
			query: () => ({
				url: '/tags',
			}),
			transformResponse: (responseData: TTagsReponse) => {
				return tagsAdapter.setAll(initialState, responseData.tags);
			},
			providesTags: (result) => {
				const tags: TagDescription<typeof TAG_TAG>[] = [
					{ type: TAG_TAG, id: 'LIST' },
				];
				result?.ids.map((id) => {
					tags.push({ type: TAG_TAG, id });
				});
				return tags;
			},
		}),
	}),
});

export const { useGetPopularTagsQuery } = tagsApi;

export const { selectAll, selectById, selectTotal, selectEntities, selectIds } =
	tagsAdapter.getSelectors();
