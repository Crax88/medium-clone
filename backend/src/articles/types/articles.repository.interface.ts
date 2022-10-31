import { DeleteResult, UpdateResult } from 'typeorm';
import { Article } from '../article.entity';
import { ArticleSaveDto } from './articleSave.dto';
import { ArticlesQueryDto } from './articlesQuery.dto';

export interface ArticlesRepositoryInterface {
	createArticle: (dto: ArticleSaveDto) => Promise<Article>;
	updateArticle: (articleId: number, dto: Omit<ArticleSaveDto, 'tags'>) => Promise<UpdateResult>;
	saveArticle: (article: Article) => Promise<Article>;
	deleteArticle: (id: number) => Promise<DeleteResult>;
	getArticles: (query: ArticlesQueryDto) => Promise<{ articles: Article[]; articlesCount: number }>;
	getArticle: (slug: string) => Promise<Article | null>;
}
