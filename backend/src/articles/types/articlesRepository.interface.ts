import { DeleteResult, UpdateResult } from 'typeorm';
import { Article } from '../article.entity';
import { ArticleDto } from './article.dto';
import { ArticleSaveDto } from './articleSave.dto';

export interface ArticlesRepositoryInterface {
	createArticle: (dto: ArticleSaveDto) => Promise<Article>;
	updateArticle: (slug: string, dto: ArticleSaveDto) => Promise<UpdateResult>;
	deleteArticle: (slug: string) => Promise<DeleteResult>;
	getArticle: (slug: string) => Promise<ArticleDto | null>;
	getArticles: (query: any) => Promise<ArticleDto[]>;
	getArticleRaw: (slug: string) => Promise<Article | null>;
}
