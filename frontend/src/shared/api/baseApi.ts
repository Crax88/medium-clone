import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { ARTICLE_TAG, TAG_TAG, SESSION_TAG } from './tags';

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: baseQuery,
	tagTypes: [ARTICLE_TAG, TAG_TAG, SESSION_TAG],
	endpoints: () => ({}),
});
