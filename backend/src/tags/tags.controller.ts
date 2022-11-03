import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../common/types/logger.interface';
import { TagsControllerInterface } from './types/tags.controller.interface';
import { TagsServiceInterface } from './types/tags.service.interface';
import { TYPES } from '../types';

@injectable()
export class TagsController extends BaseController implements TagsControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) loggerService: LoggerInterface,
		@inject(TYPES.TagsService) private tagsService: TagsServiceInterface,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/tags',
				method: 'get',
				handler: this.getPopularTags,
			},
		]);
	}

	async getPopularTags(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const popularTags = await this.tagsService.getPopularTags();
			this.ok(res, this.tagsService.buildPopularTagsResponse(popularTags));
		} catch (error) {
			next(error);
		}
	}
}
