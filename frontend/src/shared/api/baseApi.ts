import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseQuery';
import {
	ARTICLE_TAG,
	TAG_TAG,
	SESSION_TAG,
	PROFILE_TAG,
	COMMENT_TAG,
} from './tags';

export const baseApi = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	tagTypes: [ARTICLE_TAG, TAG_TAG, SESSION_TAG, PROFILE_TAG, COMMENT_TAG],
	endpoints: () => ({}),
});
