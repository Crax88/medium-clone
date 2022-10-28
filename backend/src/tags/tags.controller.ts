import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { ParsedQs } from 'qs';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../common/types/logger.interface';
import { TYPES } from '../types';
import { TagsControllerInterface } from './types/tagsController.interface';
import { TagsServiceInterface } from './types/tagsService.interface';

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
			this.ok(res, { tags: this.tagsService.buildPopularTagsResponse(popularTags) });
		} catch (error) {
			next(error);
		}
	}
}
