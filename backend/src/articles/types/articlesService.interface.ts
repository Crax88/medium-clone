import { ArticleResponseDto, ArticlesResponseDto } from './article.dto';
import { CreateArticleRequestDto } from './createArticle.dto';

export interface ArticlesServiceInterface {
	createArticle: (dto: CreateArticleRequestDto, userId: number) => Promise<ArticleResponseDto>;
	updateArticle: (slug: string, dto: any, userId: number) => Promise<ArticleResponseDto>;
	deleteArticle: (slug: string, userId: number) => Promise<void>;
	getArticle: (slug: string) => Promise<ArticleResponseDto>;
	getArticles: (query: any) => Promise<ArticlesResponseDto>;
}
