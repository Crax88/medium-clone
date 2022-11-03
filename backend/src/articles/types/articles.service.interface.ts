import { ArticleResponseDto, ArticlesResponseDto } from './article.dto';
import { ArticlesQueryDto } from './articlesQuery.dto';
import { CreateArticleRequestDto } from './createArticle.dto';
import { UpdateArticleRequestDto } from './updateArticle.dto';

export interface ArticlesServiceInterface {
	createArticle: (dto: CreateArticleRequestDto, userId: number) => Promise<ArticleResponseDto>;
	updateArticle: (
		slug: string,
		dto: UpdateArticleRequestDto,
		userId: number,
	) => Promise<ArticleResponseDto>;
	deleteArticle: (slug: string, userId: number) => Promise<void>;
	getArticle: (slug: string, userId?: number) => Promise<ArticleResponseDto>;
	getArticles: (query: ArticlesQueryDto, userId?: number) => Promise<ArticlesResponseDto>;
	getFeed: (
		query: Pick<ArticlesQueryDto, 'limit' | 'offset'>,
		userId: number,
	) => Promise<ArticlesResponseDto>;
	favoriteArticle: (slug: string, userId: number) => Promise<ArticleResponseDto>;
	unfavoriteArticle: (slug: string, userId: number) => Promise<ArticleResponseDto>;
}
