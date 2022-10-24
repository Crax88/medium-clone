import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../common/types/logger.interface';
import { AuthControllerInterface } from './types/authController.interface';
import { TYPES } from '../types';

@injectable()
export class AuthController extends BaseController implements AuthControllerInterface {
	protected _pathPrefix = '/auth';

	constructor(@inject(TYPES.LoggerService) loggerService: LoggerInterface) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [],
			},
			{
				path: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [],
			},
			{
				path: '/refresh',
				method: 'get',
				handler: this.refresh,
			},
			{
				path: '/logout',
				method: 'get',
				handler: this.logout,
			},
			{
				path: 'authenticate',
				method: 'get',
				handler: this.authenticate,
			},
		]);
	}

	async register(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}

	async refresh(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}

	async authenticate(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}
}
