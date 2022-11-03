import { inject, injectable } from 'inversify';
import slugify from 'slugify';
import { HttpError } from '../errors/httpError';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Article } from './article.entity';
import { ArticlesServiceInterface } from './types/articlesService.interface';
import { TagsServiceInterface } from '../tags/types/tags.service.interface';
import { ArticlesRepositoryInterface } from './types/articles.repository.interface';
import { ArticleResponseDto, ArticlesResponseDto } from './types/article.dto';
import { ArticleSaveDto } from './types/articleSave.dto';
import { CreateArticleRequestDto } from './types/createArticle.dto';
import { UpdateArticleRequestDto } from './types/updateArticle.dto';
import { ArticlesQueryDto } from './types/articlesQuery.dto';
import { TYPES } from '../types';

@injectable()
export class ArticlesService implements ArticlesServiceInterface {
	constructor(
		@inject(TYPES.TagsService) private tagsService: TagsServiceInterface,
		@inject(TYPES.ArticlesRepository) private articlesRepository: ArticlesRepositoryInterface,
	) {}

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
		await this.articlesRepository.createArticle({
			...article,
			slug,
			authorId: userId,
			tags,
		});

		return this.getArticle(slug, userId);
	}

	async updateArticle(
		slug: string,
		{ article }: UpdateArticleRequestDto,
		userId: number,
	): Promise<ArticleResponseDto> {
		const foundArticle = await this.articlesRepository.getArticle(slug);

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

		const result = await this.articlesRepository.updateArticle(foundArticle.id, toUpdate);

		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'article not found');
		}
		return this.getArticle(toUpdate.slug, userId);
	}

	async deleteArticle(slug: string, userId: number): Promise<void> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}

		if (article.authorId !== userId) {
			throw new HttpError(403, 'not authorized');
		}

		const result = await this.articlesRepository.deleteArticle(article.id);
		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'article not found');
		}
	}

	async getArticle(slug: string, userId?: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}

		return {
			article: {
				slug: article.slug,
				title: article.title,
				description: article.description,
				body: article.body,
				createdAt: article.createdAt,
				updatedAt: article.updatedAt,
				favoritesCount: article.favorite.length,
				favorited: article.favorite.findIndex((favorite: User) => favorite.id === userId) > -1,
				tagList: article.tags.map((tag: Tag) => tag.tagName),
				author: {
					username: article.author.username,
					bio: article.author.bio,
					image: article.author.image,
				},
			},
		};
	}

	async getArticles(query: ArticlesQueryDto, userId?: number): Promise<ArticlesResponseDto> {
		const { articles, articlesCount } = await this.articlesRepository.getArticles(query);
		return {
			articlesCount,
			articles: articles.map((article: Article) => {
				return {
					slug: article.slug,
					title: article.title,
					description: article.description,
					body: article.body,
					createdAt: article.createdAt,
					updatedAt: article.updatedAt,
					favoritesCount: article.favorite.length,
					favorited: article.favorite.findIndex((favorite) => favorite.id === userId) > -1,
					tagList: article.tags.map((tag) => tag.tagName),
					author: {
						username: article.author.username,
						bio: article.author.bio,
						image: article.author.image,
					},
				};
			}),
		};
	}

	async getFeed(
		query: Pick<ArticlesQueryDto, 'limit' | 'offset'>,
		userId: number,
	): Promise<ArticlesResponseDto> {
		const { articles } = await this.articlesRepository.getArticles(query);
		const filteredArticles = articles.filter((article: Article) =>
			article.author.followers.find((follower: User) => follower.id === userId),
		);
		return {
			articlesCount: filteredArticles.length,
			articles: filteredArticles.map((article: Article) => {
				return {
					slug: article.slug,
					title: article.title,
					description: article.description,
					body: article.body,
					createdAt: article.createdAt,
					updatedAt: article.updatedAt,
					favoritesCount: article.favorite.length,
					favorited: article.favorite.findIndex((favorite: User) => favorite.id === userId) > -1,
					tagList: article.tags.map((tag: Tag) => tag.tagName),
					author: {
						username: article.author.username,
						bio: article.author.bio,
						image: article.author.image,
					},
				};
			}),
		};
	}

	async favoriteArticle(slug: string, userId: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		if (article?.favorite.find((user: User) => user.id === userId)) {
			article.favorite = article.favorite.filter((user: User) => user.id !== userId);
		} else {
			article?.favorite.push({ id: userId } as User);
		}
		await this.articlesRepository.saveArticle(article);
		return await this.getArticle(slug, userId);
	}

	private createSlug(title: string): string {
		return (
			slugify(title, { lower: true, replacement: '-', trim: true }) +
			'-' +
			Date.now().toString().slice(7)
		);
	}
}
