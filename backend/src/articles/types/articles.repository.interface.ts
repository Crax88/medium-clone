import { ArticleDto } from './article.dto';
import { ArticleSaveDto } from './articleSave.dto';
import { ArticlesQueryDto } from './articlesQuery.dto';

export interface ArticlesRepositoryInterface {
	createArticle: (dto: ArticleSaveDto) => Promise<void>;
	updateArticle: (slug: string, dto: Omit<ArticleSaveDto, 'tags'>) => Promise<void>;
	deleteArticle: (slug: string) => Promise<void>;
	getArticles: (
		query: ArticlesQueryDto,
	) => Promise<{ articles: ArticleDto[]; articlesCount: number }>;
	getArticle: (slug: string, currentUserId?: number) => Promise<ArticleDto | null>;
	favoriteArticle: (slug: string, currentUserId: number) => Promise<void>;
	unfavoriteArticle: (slug: string, currentUserId: number) => Promise<void>;
}
