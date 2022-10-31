import { inject, injectable } from 'inversify';
import slugify from 'slugify';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { HttpError } from '../errors/httpError';
import { Tag } from '../tags/tag.entity';
import { Article } from './article.entity';
import { ArticlesServiceInterface } from './types/articlesService.interface';
import { TagsServiceInterface } from '../tags/types/tagsService.interface';
import { QueryHelperInterface } from '../shared/types/queryHelper.interface';
import { ArticleResponseDto, ArticlesResponseDto } from './types/article.dto';
import { ArticleSaveDto } from './types/articleSave.dto';
import { CreateArticleRequestDto } from './types/createArticle.dto';
import { UpdateArticleRequestDto } from './types/updateArticle.dto';
import { ArticlesQueryDto } from './types/articlesQuery.dto';
import { TYPES } from '../types';
import { User } from '../users/user.entity';

@injectable()
export class ArticlesService implements ArticlesServiceInterface {
	private articlesRepository: Repository<Article>;
	constructor(
		@inject(TYPES.DatabaseService) databaseService: TypeormService,
		@inject(TYPES.TagsService) private tagsService: TagsServiceInterface,
		@inject(TYPES.QueryHelper) private queryHelper: QueryHelperInterface,
	) {
		this.articlesRepository = databaseService.getRepository(Article);
	}

	async createArticle(
		{ article }: CreateArticleRequestDto,
		userId: number,
	): Promise<ArticleResponseDto> {
		const slug = this.createSlug(article.title);
		const tags: Tag[] = [];
		if (article.tagList && article.tagList.length) {
			for (const tag of article.tagList) {
				tags.push(await this.tagsService.saveTag(tag));
			}
		}
		const newArticle = this.articlesRepository.create({
			...article,
			slug,
			authorId: userId,
			tags,
		});
		await this.articlesRepository.save(newArticle);
		return this.getArticle(slug);
	}

	async updateArticle(
		slug: string,
		{ article }: UpdateArticleRequestDto,
		userId: number,
	): Promise<ArticleResponseDto> {
		const foundArticle = await this.articlesRepository.findOneBy({ slug });

		if (!foundArticle) {
			throw new HttpError(404, 'article not found');
		}
		if (foundArticle.authorId !== userId) {
			throw new HttpError(403, 'not authorized');
		}
		const toUpdate: Omit<ArticleSaveDto, 'tags'> = {
			title: article.title || foundArticle.title,
			description: article.description || foundArticle.description,
			body: article.body || foundArticle.body,
			authorId: userId,
			slug: article.title ? this.createSlug(article.title) : foundArticle.slug,
		};

		const result = await this.articlesRepository.update({ slug }, toUpdate);

		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'article not found');
		}
		return this.getArticle(toUpdate.slug);
	}

	async deleteArticle(slug: string, userId: number): Promise<void> {
		const article = await this.articlesRepository.findOneBy({ slug });
		if (!article) {
			throw new HttpError(404, 'article not found');
		}

		if (article.authorId !== userId) {
			throw new HttpError(403, 'not authorized');
		}

		const result = await this.articlesRepository.delete({ slug });
		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'article not found');
		}
	}

	async getArticle(slug: string, userId?: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository
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
				'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
				`CASE WHEN ${userId ? userId : null} IS NOT NULL AND ${
					userId ? userId : null
				}=ANY(af."userIds") THEN true ELSE false END as favorited`,
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
			.leftJoin(
				(qb: SelectQueryBuilder<Article>) => {
					return qb
						.select([
							'af."article_id" as "articleId"',
							'COUNT(*) as "favoritesCount", array_agg(u.username) as "usernames", array_agg(u.id) as "userIds"',
						])
						.from('article_favorites', 'af')
						.innerJoin('users', 'u', 'af.user_id = u.id')
						.groupBy('"af"."article_id"');
				},
				'af',
				'af."articleId" = article.id',
			)
			.where('article.slug = :slug', { slug })
			.getRawOne();

		if (!article) {
			throw new HttpError(404, 'article not found');
		}

		return { article };
	}

	async getArticles(query: ArticlesQueryDto, userId?: number): Promise<ArticlesResponseDto> {
		const articles = await this.articlesRepository
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
				'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
				`CASE WHEN ${userId ? userId : null} IS NOT NULL AND ${
					userId ? userId : null
				}=ANY(af."userIds") THEN true ELSE false END as favorited`,
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
			.leftJoin(
				(qb: SelectQueryBuilder<Article>) => {
					return qb
						.select([
							'af."article_id" as "articleId"',
							'COUNT(*) as "favoritesCount", array_agg(u.username) as "usernames", array_agg(u.id) as "userIds"',
						])
						.from('article_favorites', 'af')
						.innerJoin('users', 'u', 'af.user_id = u.id')
						.groupBy('"af"."article_id"');
				},
				'af',
				'af."articleId" = article.id',
			)
			.where(`${this.queryHelper.parameterOrNull('user.username', 'username')}`, {
				username: this.queryHelper.valueOrNull(query.author, 'string'),
			})
			.andWhere(this.queryHelper.parameterOrNull('t."tagList"::text', 'tag', 'ILIKE'), {
				tag: this.queryHelper.valueOrNull(query.tag, 'string') ? `%${query.tag}%` : null,
			})
			.andWhere(this.queryHelper.parameterOrNull('af."usernames"::text', 'favorited', 'ILIKE'), {
				favorited: this.queryHelper.valueOrNull(query.favorited, 'string')
					? `%${query.favorited}%`
					: null,
			})
			.limit(query.limit ? Number(query.limit) : 10)
			.offset(query.offset ? Number(query.offset) : 0)
			.orderBy('article.created_at', 'DESC')
			.getRawMany();

		return { articles };
	}

	async getFeed(
		query: Pick<ArticlesQueryDto, 'limit' | 'offset'>,
		userId: number,
	): Promise<ArticlesResponseDto> {
		const articles = await this.articlesRepository
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
				'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
				`CASE WHEN ${userId ? userId : null} IS NOT NULL AND ${
					userId ? userId : null
				}=ANY(af."userIds") THEN true ELSE false END as favorited`,
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
			.leftJoin(
				(qb: SelectQueryBuilder<Article>) => {
					return qb
						.select([
							'af."article_id" as "articleId"',
							'COUNT(*) as "favoritesCount", array_agg(u.username) as "usernames", array_agg(u.id) as "userIds"',
						])
						.from('article_favorites', 'af')
						.innerJoin('users', 'u', 'af.user_id = u.id')
						.groupBy('"af"."article_id"');
				},
				'af',
				'af."articleId" = article.id',
			)
			.where(
				'article.author_id IN (SELECT following_id FROM profile_followers WHERE follower_id = :userId)',
				{ userId },
			)
			.limit(query.limit ? Number(query.limit) : 10)
			.offset(query.offset ? Number(query.offset) : 0)
			.orderBy('article.created_at', 'DESC')
			.getRawMany();

		return { articles };
	}

	async favoriteArticle(slug: string, userId: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.findOne({
			where: { slug },
			relations: {
				favorite: true,
			},
		});
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		if (article?.favorite.find((user) => user.id === userId)) {
			article.favorite = article.favorite.filter((user) => user.id !== userId);
		} else {
			article?.favorite.push({ id: userId } as User);
		}
		await this.articlesRepository.save(article);
		return await this.getArticle(slug);
	}

	private createSlug(title: string): string {
		return (
			slugify(title, { lower: true, replacement: '-', trim: true }) +
			'-' +
			Date.now().toString().slice(7)
		);
	}
}
