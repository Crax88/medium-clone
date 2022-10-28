import { inject, injectable } from 'inversify';
import { DeleteResult, QueryBuilder, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Article } from './article.entity';
import { ArticlesRepositoryInterface } from './types/articlesRepository.interface';
import { ArticleDto } from './types/article.dto';
import { ArticleSaveDto } from './types/articleSave.dto';
import { TYPES } from '../types';
import { ArticlesQueryDto } from './types/articlesQuery.dto';
import { Tag } from '../tags/tag.entity';

@injectable()
export class ArticlesRepository implements ArticlesRepositoryInterface {
	private repository: Repository<Article>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Article);
	}

	async createArticle(dto: ArticleSaveDto): Promise<Article> {
		const newArticle = this.repository.create(dto);
		await this.repository.save(newArticle);
		return newArticle;
	}

	async updateArticle(slug: string, dto: ArticleSaveDto): Promise<UpdateResult> {
		return await this.repository.update({ slug }, dto);
	}

	async deleteArticle(slug: string): Promise<DeleteResult> {
		return await this.repository.delete({ slug });
	}

	async getArticle(slug: string): Promise<ArticleDto | null> {
		const article = await this.repository
			.createQueryBuilder('article')
			.select([
				'article.slug as slug',
				'article.title as title',
				'article.description as description',
				'article.body as body',
				'article.createdAt as createdAt',
				'article.updatedAt as updatedAt',
				'json_build_object(\'username\',"user"."username",\'bio\',"user"."bio",\'image\',"user"."image") as author',
				'COALESCE(t."tagList", \'{}\') as "tagList"',
			])
			.innerJoin('article.author', 'user')
			.leftJoin(
				(qb: SelectQueryBuilder<Tag>) => {
					return qb
						.select(['at."article_id" as "articleId"', 'array_agg(t.tag_name) as "tagList"'])
						.from('tags', 't')
						.innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
						.groupBy('"article_id"');
				},
				't',
				't."articleId" = article.id',
			)
			.where('article.slug = :slug', { slug })
			.getRawOne();

		return article;
	}

	async getArticles(query: ArticlesQueryDto): Promise<ArticleDto[]> {
		const articles = await this.repository
			.createQueryBuilder('article')
			.select([
				'article.slug as slug',
				'article.title as title',
				'article.description as description',
				'article.body as body',
				'article.createdAt as createdAt',
				'article.updatedAt as updatedAt',
				'json_build_object(\'username\',"user"."username",\'bio\',"user"."bio",\'image\',"user"."image") as author',
				'COALESCE(t."tagList", \'{}\') as "tagList"',
			])
			.innerJoin('article.author', 'user')
			.leftJoin(
				(qb: SelectQueryBuilder<Tag>) => {
					return qb
						.select(['at."article_id" as "articleId"', 'array_agg(t.tag_name) as "tagList"'])
						.from('tags', 't')
						.innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
						.groupBy('"article_id"');
				},
				't',
				't."articleId" = article.id',
			)
			.where(`${this.parameterOrNull('user.username', 'username')}`, {
				username: this.valueOrNull(query.author, 'string'),
			})
			.andWhere(this.parameterOrNull('t."tagList"::text', 'tag', 'ILIKE'), {
				tag: this.valueOrNull(query.tag, 'string') ? `%${query.tag}%` : null,
			})
			.limit(query.limit ? Number(query.limit) : 10)
			.offset(query.offset ? Number(query.offset) : 0)
			.orderBy('article.created_at', 'DESC')
			.getRawMany();

		return articles;
	}

	async getArticleRaw(slug: string): Promise<Article | null> {
		return await this.repository.findOne({ where: { slug } });
	}

	private parameterOrNull(columnName: string, paramName: string, operator = '='): string {
		return `(${columnName} ${operator} :${paramName} OR COALESCE(:${paramName}, NULL) IS NULL)`;
	}

	private valueOrNull(value: unknown, type: 'string' | 'number'): number | string | null {
		if (type === 'string' && typeof value === 'string') {
			return value.toString() ?? null;
		}
		if (type === 'number' && typeof value !== 'object') {
			return value === undefined || value === null ? null : +value;
		}
		return null;
	}
}
