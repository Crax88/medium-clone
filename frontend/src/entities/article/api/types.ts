import { type TArticle } from '../model/types';

export type TArticlesReponseDto = {
	articles: TArticle[];
	articlesCount: number;
};

export type TArticleResponseDto = {
	article: TArticle;
};

export type TArticlesRequestDto = {
	author?: string;
	favorited?: string;
	tag?: string;
	limit?: number;
	offset?: number;
	isFeed?: boolean;
};

export type TArticleRequestDto = {
	slug: TArticle['slug'];
};

export type TArticleCreateDto = {
	title: string;
	description: string;
	body: string;
	tagList: string[];
};
