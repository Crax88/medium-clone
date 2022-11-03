import { inject, injectable } from 'inversify';
import slugify from 'slugify';
import { HttpError } from '../errors/httpError';
import { Tag } from '../tags/tag.entity';
import { User } from '../users/user.entity';
import { Article } from './article.entity';
import { ArticlesServiceInterface } from './types/articles.service.interface';
import { TagsServiceInterface } from '../tags/types/tags.service.interface';
import { ArticlesRepositoryInterface } from './types/articles.repository.interface';
import { ArticleResponseDto, ArticlesResponseDto } from './types/article.dto';
import { ArticleSaveDto } from './types/articleSave.dto';
import { CreateArticleRequestDto } from './types/createArticle.dto';
import { UpdateArticleRequestDto } from './types/updateArticle.dto';
import { ArticlesQueryDto } from './types/articlesQuery.dto';
import { TYPES } from '../types';
import { TagDto } from '../tags/types/tags.dto';
import { UsersRepositoryInterface } from '../users/types/users.repository.interface';

@injectable()
export class ArticlesService implements ArticlesServiceInterface {
	constructor(
		@inject(TYPES.TagsService) private tagsService: TagsServiceInterface,
		@inject(TYPES.ArticlesRepository) private articlesRepository: ArticlesRepositoryInterface,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
	) {}

	async createArticle(
		{ article }: CreateArticleRequestDto,
		userId: number,
	): Promise<ArticleResponseDto> {
		const slug = this.createSlug(article.title);
		const tags: TagDto[] = [];
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
		const user = await this.usersRepository.findUser({ id: userId });
		if (!user) {
			throw new HttpError(404, 'user profile not found');
		}
		if (foundArticle.author.username !== user.username) {
			throw new HttpError(403, 'not authorized');
		}
		const toUpdate: Omit<ArticleSaveDto, 'tags'> = {
			title: article.title || foundArticle.title,
			description: article.description || foundArticle.description,
			body: article.body || foundArticle.body,
			authorId: userId,
			slug: article.title ? this.createSlug(article.title) : foundArticle.slug,
		};

		await this.articlesRepository.updateArticle(slug, toUpdate);

		return this.getArticle(toUpdate.slug, userId);
	}

	async deleteArticle(slug: string, userId: number): Promise<void> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		const user = await this.usersRepository.findUser({ id: userId });
		if (!user) {
			throw new HttpError(404, 'user profile not found');
		}
		if (article.author.username !== user.username) {
			throw new HttpError(403, 'not authorized');
		}

		await this.articlesRepository.deleteArticle(slug);
	}

	async getArticle(slug: string, userId?: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}

		return { article };
	}

	async getArticles(query: ArticlesQueryDto, userId?: number): Promise<ArticlesResponseDto> {
		const { articles, articlesCount } = await this.articlesRepository.getArticles({
			...query,
			userId,
		});

		return { articles, articlesCount };
	}

	async getFeed(
		query: Pick<ArticlesQueryDto, 'limit' | 'offset'>,
		userId: number,
	): Promise<ArticlesResponseDto> {
		const { articles, articlesCount } = await this.articlesRepository.getArticles({
			...query,
			followerId: userId,
		});

		return { articles, articlesCount };
	}

	async favoriteArticle(slug: string, userId: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.getArticle(slug, userId);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		if (article.favorited) {
			return { article };
		}
		await this.articlesRepository.favoriteArticle(slug, userId);
		article.favorited = true;
		article.favoritesCount += 1;

		return { article };
	}

	async unfavoriteArticle(slug: string, userId: number): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.getArticle(slug, userId);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}
		if (!article.favorited) {
			return { article };
		}
		await this.articlesRepository.unfavoriteArticle(slug, userId);
		article.favorited = false;
		article.favoritesCount -= 1;

		return { article };
	}

	private createSlug(title: string): string {
		return (
			slugify(title, { lower: true, replacement: '-', trim: true }) +
			'-' +
			Date.now().toString().slice(7)
		);
	}
}
