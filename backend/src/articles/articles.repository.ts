import { inject, injectable } from 'inversify';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { TypeormService } from '../shared/services/typeorm.service';
import { QueryHelperInterface } from '../shared/types/queryHelper.interface';
import { Tag } from '../tags/tag.entity';
import { TYPES } from '../types';

import { ArticleDto } from './types/article.dto';
import { ArticlesRepositoryInterface } from './types/articles.repository.interface';
import { ArticleSaveDto } from './types/articleSave.dto';
import { ArticlesQueryDto } from './types/articlesQuery.dto';
import { Article } from './article.entity';

@injectable()
export class ArticlesRepository implements ArticlesRepositoryInterface {
	private repository: Repository<Article>;

	constructor(
		@inject(TYPES.DatabaseService) databaseService: TypeormService,
		@inject(TYPES.QueryHelper) private queryHelper: QueryHelperInterface,
	) {
		this.repository = databaseService.getRepository(Article);
	}

	async createArticle(dto: ArticleSaveDto): Promise<void> {
		const newArticle = this.repository.create(dto);
		await this.repository.save(newArticle);
	}

	async updateArticle(slug: string, dto: Omit<ArticleSaveDto, 'tags'>): Promise<void> {
		await this.repository.update({ slug }, dto);
	}

	async deleteArticle(slug: string): Promise<void> {
		await this.repository.delete({ slug });
	}

	async getArticles(
		query: ArticlesQueryDto,
	): Promise<{ articles: ArticleDto[]; articlesCount: number }> {
		const articlesQuery = this.repository
			.createQueryBuilder('a')
			.select([
				'a.slug as slug',
				'a.title as title',
				'a.description as description',
				'a.body as body',
				'a.created_at as createdAt',
				'a.updated_at as updatedAt',
				'json_build_object(\'username\',"u"."username",\'bio\',"u"."bio",\'image\',"u"."image", \'following\', COALESCE(pf.follower_id::bool, false)) as author',
				'COALESCE(t."tagList", \'{}\') as "tagList"',
				'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
				`CASE WHEN ${query.userId ? query.userId : null} IS NOT NULL AND ${
					query.userId ? query.userId : null
				}=ANY(af."userIds") THEN true ELSE false END as favorited`,
			])
			.innerJoin('users', 'u', 'u.id = a.author_id')
			.leftJoin(
				(qb: SelectQueryBuilder<Tag>) => {
					return qb
						.select(['at."article_id" as "articleId"', 'array_agg(t.tag_name) as "tagList"'])
						.from('tags', 't')
						.innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
						.groupBy('"article_id"');
				},
				't',
				't."articleId" = a.id',
			)
			.leftJoin(
				(qb: SelectQueryBuilder<Article>) => {
					return qb
						.select([
							'af."article_id" as "articleId"',
							'COUNT(*) as "favoritesCount"',
							'array_agg(u.username) as "usernames"',
							'array_agg(u.id) as "userIds"',
						])
						.from('article_favorites', 'af')
						.innerJoin('users', 'u', 'af.user_id = u.id')
						.groupBy('"af"."article_id"');
				},
				'af',
				'af."articleId" = a.id',
			)
			.leftJoin(
				'profile_followers',
				'pf',
				`pf.following_id = a.author_id AND CASE WHEN ${
					query.followerId ? query.followerId : null
				} IS NOT NULL THEN ${
					query.followerId ? query.followerId : null
				} = pf.follower_id ELSE false END`,
			)
			.where(`${this.queryHelper.parameterOrNull('u.username', 'username')}`, {
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
			.andWhere(this.queryHelper.parameterOrNull('pf.follower_id', 'follower'), {
				follower: this.queryHelper.valueOrNull(query.followerId, 'number'),
			})
			.orderBy('a.created_at', 'DESC');

		const articlesCount = await articlesQuery.getCount();
		const articles = await articlesQuery
			.limit(query.limit ? Number(query.limit) : 10)
			.offset(query.offset ? Number(query.offset) : 0)
			.getRawMany();

		return { articles, articlesCount };
	}

	async getArticle(slug: string, currentUserId?: number): Promise<ArticleDto | null> {
		const article = await this.repository
			.createQueryBuilder('a')
			.select([
				'a.slug as slug',
				'a.title as title',
				'a.description as description',
				'a.body as body',
				'a.created_at as createdAt',
				'a.updated_at as updatedAt',
				'json_build_object(\'username\',"u"."username",\'bio\',"u"."bio",\'image\',"u"."image", \'following\', COALESCE(pf.follower_id::bool, false)) as author',
				'COALESCE(t."tagList", \'{}\') as "tagList"',
				'COALESCE("af"."favoritesCount"::integer, 0) as "favoritesCount"',
				`CASE WHEN ${currentUserId ? currentUserId : null} IS NOT NULL AND ${
					currentUserId ? currentUserId : null
				}=ANY(af."userIds") THEN true ELSE false END as favorited`,
			])
			.innerJoin('users', 'u', 'u.id = a.author_id')
			.leftJoin(
				(qb: SelectQueryBuilder<Tag>) => {
					return qb
						.select(['at."article_id" as "articleId"', 'array_agg(t.tag_name) as "tagList"'])
						.from('tags', 't')
						.innerJoin('article_tags', 'at', 'at."tag_id" = t.id')
						.groupBy('"article_id"');
				},
				't',
				't."articleId" = a.id',
			)
			.leftJoin(
				(qb: SelectQueryBuilder<Article>) => {
					return qb
						.select([
							'af."article_id" as "articleId"',
							'COUNT(*) as "favoritesCount"',
							'array_agg(u.username) as "usernames"',
							'array_agg(u.id) as "userIds"',
						])
						.from('article_favorites', 'af')
						.innerJoin('users', 'u', 'af.user_id = u.id')
						.groupBy('"af"."article_id"');
				},
				'af',
				'af."articleId" = a.id',
			)
			.leftJoin(
				'profile_followers',
				'pf',
				`pf.following_id = a.author_id AND CASE WHEN ${
					currentUserId ? currentUserId : null
				} IS NOT NULL THEN ${currentUserId ? currentUserId : null} = pf.follower_id ELSE false END`,
				{ userId: currentUserId },
			)
			.where('a.slug = :slug', { slug })
			.getRawOne();

		return article;
	}

	async favoriteArticle(slug: string, currentUserId: number): Promise<void> {
		await this.repository.query(
			'INSERT INTO article_favorites (article_id, user_id) VALUES ((SELECT id FROM articles WHERE slug = $1), $2)',
			[slug, currentUserId],
		);
	}

	async unfavoriteArticle(slug: string, currentUserId: number): Promise<void> {
		await this.repository.query(
			'DELETE FROM article_favorites WHERE article_id = (SELECT id FROM articles WHERE slug = $1) AND user_id = $2',
			[slug, currentUserId],
		);
	}
}
