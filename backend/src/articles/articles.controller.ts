import { injectable, inject } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { ValidationMiddleware } from '../common/validation.middleware';
import { AuthGuard } from '../shared/services/auth.guard';
import { ArticlesControllerInterface } from './types/articlesController.interface';
import { ArticlesServiceInterface } from './types/articlesService.interface';
import { LoggerInterface } from '../common/types/logger.interface';
import { CreateArticleRequestDto } from './types/createArticle.dto';
import { UpdateArticleRequestDto } from './types/updateArticle.dto';
import { TYPES } from '../types';

interface Params {
	slug: string;
}

@injectable()
export class ArticlesContoller extends BaseController implements ArticlesControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) loggerService: LoggerInterface,
		@inject(TYPES.ArticlesService) private articlesService: ArticlesServiceInterface,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/articles',
				method: 'get',
				handler: this.getArticles,
			},
			{
				path: '/articles/feed',
				method: 'get',
				handler: this.getFeed,
			},
			{
				path: '/articles/:slug',
				method: 'get',
				handler: this.getArticle,
			},
			{
				path: '/articles',
				method: 'post',
				handler: this.createArticle,
				middlewares: [new AuthGuard(), new ValidationMiddleware(CreateArticleRequestDto)],
			},
			{
				path: '/articles/:slug',
				method: 'put',
				handler: this.updateArticle,
				middlewares: [new AuthGuard(), new ValidationMiddleware(UpdateArticleRequestDto)],
			},
			{
				path: '/articles/:slug',
				method: 'delete',
				handler: this.deleteArticle,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async getArticles(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articles = await this.articlesService.getArticles({});
			this.ok(res, { articles });
		} catch (error) {
			next(error);
		}
	}

	async getFeed(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const articles = await this.articlesService.getArticles({});
			this.ok(res, { articles });
		} catch (error) {
			next(error);
		}
	}

	async getArticle(
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const article = await this.articlesService.getArticle(req.params.slug);
			this.ok(res, { article });
		} catch (error) {
			next(error);
		}
	}

	async createArticle(
		req: Request<{}, {}, CreateArticleRequestDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const article = await this.articlesService.createArticle(req.body, req.userId);
			this.ok(res, { article });
		} catch (error) {
			next(error);
		}
	}

	async updateArticle(
		req: Request<{ slug: string }, {}, UpdateArticleRequestDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const article = await this.articlesService.updateArticle(
				req.params.slug,
				req.body,
				req.userId,
			);
			this.ok(res, { article });
		} catch (error) {
			next(error);
		}
	}

	async deleteArticle(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.articlesService.deleteArticle(req.params.slug, req.userId);
			this.ok(res, { article: {} });
		} catch (error) {
			next(error);
		}
	}
}
