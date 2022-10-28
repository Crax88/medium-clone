export interface ArticleDto {
	slug: string;
	title: string;
	description: string;
	body: string;
	createAt: string;
	updatedAt: string;
	author: {
		username: string;
		bio: string;
		image: string;
	};
	tagList: string[];
}

export interface ArticleResponseDto {
	article: ArticleDto;
}

export interface ArticlesResponseDto {
	articles: ArticleDto[];
}
