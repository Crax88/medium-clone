import { TArticle } from 'entities/article';

export type TFavoriteRequestDto = {
	slug: TArticle['slug'];
};
export type TFavoriteArticleResponseDto = {
	article: TArticle;
};
