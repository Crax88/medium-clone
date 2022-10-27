import { inject, injectable } from 'inversify';
import slugify from 'slugify';
import { HttpError } from '../errors/httpError';
import { ArticlesServiceInterface } from './types/articlesService.interface';
import { ArticlesRepositoryInterface } from './types/articlesRepository.interface';
import { ArticleResponseDto, ArticlesResponseDto } from './types/article.dto';
import { ArticleSaveDto } from './types/articleSave.dto';
import { CreateArticleRequestDto } from './types/createArticle.dto';
import { UpdateArticleRequestDto } from './types/updateArticle.dto';
import { TYPES } from '../types';

@injectable()
export class ArticlesService implements ArticlesServiceInterface {
	constructor(
		@inject(TYPES.ArticlesRepository) private articlesRepository: ArticlesRepositoryInterface,
	) {}

	async createArticle(
		{ article }: CreateArticleRequestDto,
		userId: number,
	): Promise<ArticleResponseDto> {
		const slug = this.createSlug(article.title);
		await this.articlesRepository.createArticle({
			...article,
			slug,
			authorId: userId,
		});
		return this.getArticle(slug);
	}

	async updateArticle(
		slug: string,
		{ article }: UpdateArticleRequestDto,
		userId: number,
	): Promise<ArticleResponseDto> {
		const foundArticle = await this.articlesRepository.getArticleRaw(slug);

		if (!foundArticle) {
			throw new HttpError(404, 'article not found');
		}
		if (foundArticle.authorId !== userId) {
			throw new HttpError(403, 'not authorized');
		}
		const toUpdate: ArticleSaveDto = {
			title: article.title || foundArticle.title,
			description: article.description || foundArticle.description,
			body: article.body || foundArticle.body,
			slug: article.title ? this.createSlug(article.title) : foundArticle.slug,
			authorId: userId,
		};

		const result = await this.articlesRepository.updateArticle(slug, toUpdate);

		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'article not found');
		}
		return this.getArticle(toUpdate.slug);
	}

	async deleteArticle(slug: string, userId: number): Promise<void> {
		const result = await this.articlesRepository.deleteArticle(slug);
		if (!result.affected || result.affected === 0) {
			throw new HttpError(404, 'article not found');
		}
	}

	async getArticle(slug: string): Promise<ArticleResponseDto> {
		const article = await this.articlesRepository.getArticle(slug);
		if (!article) {
			throw new HttpError(404, 'article not found');
		}

		return { article };
	}

	async getArticles(query: any): Promise<ArticlesResponseDto> {
		const articles = await this.articlesRepository.getArticles(query);
		return { articles };
	}

	private createSlug(title: string): string {
		return (
			slugify(title, { lower: true, replacement: '-', trim: true }) +
			'-' +
			Date.now().toString().slice(7)
		);
	}
}
