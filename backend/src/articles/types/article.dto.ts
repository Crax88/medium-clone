export interface ArticleDto {
	slug: string;
	title: string;
	description: string;
	body: string;
	createdAt: string;
	updatedAt: string;
	author: {
		username: string;
		bio: string | null;
		image: string | null;
	};
	tagList: string[];
	favoritesCount: number;
	favorited: boolean;
}

export interface ArticleResponseDto {
	article: ArticleDto;
}

export interface ArticlesResponseDto {
	articles: ArticleDto[];
	articlesCount: number;
}
