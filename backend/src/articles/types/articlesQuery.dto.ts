export interface ArticlesQueryDto {
	limit?: string;
	offset?: string;
	author?: string;
	tag?: string;
	favorited?: string;
	followed?: string[];
}
