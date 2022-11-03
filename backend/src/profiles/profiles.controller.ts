import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../common/types/logger.interface';
import { AuthGuard } from '../shared/services/auth.guard';
import { ProfilesControllerInterface } from './types/profiles.controller.interface';
import { ProfilesServiceInterface } from './types/profiles.service.interface';
import { TYPES } from '../types';

@injectable()
export class ProfilesController extends BaseController implements ProfilesControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) loggerService: LoggerInterface,
		@inject(TYPES.ProfilesService) private profilesService: ProfilesServiceInterface,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/profiles/:username',
				method: 'get',
				handler: this.getProfile,
			},
			{
				path: '/profiles/:username/follow',
				method: 'post',
				handler: this.followProfile,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/profiles/:username/follow',
				method: 'delete',
				handler: this.unfollowProfile,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async getProfile(
		req: Request<{ username: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.profilesService.getProfile(req.params.username, req.userId);
			this.ok(res, result);
		} catch (error) {
			next(error);
		}
	}

	async followProfile(
		req: Request<{ username: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.profilesService.followProfile(req.params.username, req.userId);
			this.ok(res, result);
		} catch (error) {
			next(error);
		}
	}

	async unfollowProfile(
		req: Request<{ username: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.profilesService.unfollowProfile(req.params.username, req.userId);
			this.ok(res, result);
		} catch (error) {
			next(error);
		}
	}
}
