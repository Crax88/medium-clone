import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../common/types/logger.interface';
import { ValidationMiddleware } from '../common/validation.middleware';
import { AuthGuard } from '../shared/services/auth.guard';
import { TYPES } from '../types';

import { CommentsControllerInterface } from './types/comments.controller.interface';
import { CommentsServiceInterface } from './types/comments.service.interface';
import { CreateCommentRequestDto } from './types/createComment.dto';

@injectable()
export class CommentsController extends BaseController implements CommentsControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) loggerService: LoggerInterface,
		@inject(TYPES.CommentsService) private commentsService: CommentsServiceInterface,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/articles/:slug/comments',
				method: 'post',
				handler: this.createComment,
				middlewares: [new AuthGuard(), new ValidationMiddleware(CreateCommentRequestDto)],
			},
			{
				path: '/articles/:slug/comments/:id',
				method: 'delete',
				handler: this.deleteComment,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/articles/:slug/comments',
				method: 'get',
				handler: this.getComments,
			},
		]);
	}

	async createComment(
		req: Request<{ slug: string }, {}, CreateCommentRequestDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.commentsService.createComment(
				req.params.slug,
				req.body,
				req.userId,
			);
			this.created(res, result);
		} catch (error) {
			next(error);
		}
	}

	async deleteComment(
		req: Request<{ slug: string; id: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			await this.commentsService.deleteComment(req.params.slug, Number(req.params.id), req.userId);
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}

	async getComments(
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.commentsService.getComments(req.params.slug, req.userId);
			this.ok(res, result);
		} catch (error) {
			next(error);
		}
	}
}
