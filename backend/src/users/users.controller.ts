import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { LoggerInterface } from '../common/types/logger.interface';
import { ValidationMiddleware } from '../common/validation.middleware';
import { AuthGuard } from '../shared/services/auth.guard';
import { UsersControllerInterface } from './types/users.controller.interface';
import { UsersServiceInterface } from './types/users.service.interface';
import { UserLoginRequestDto } from './types/userLogin.dto';
import { UserRegisterRequestDto } from './types/userRegister.dto';
import { UserUpdateDto } from './types/userUpdate.dto';
import { TYPES } from '../types';

@injectable()
export class UsersController extends BaseController implements UsersControllerInterface {
	constructor(
		@inject(TYPES.LoggerService) loggerService: LoggerInterface,
		@inject(TYPES.UsersService) private usersService: UsersServiceInterface,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/users',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidationMiddleware(UserRegisterRequestDto)],
			},
			{
				path: '/users/login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidationMiddleware(UserLoginRequestDto)],
			},
			{
				path: '/users/refresh',
				method: 'get',
				handler: this.refresh,
			},
			{
				path: '/users/logout',
				method: 'delete',
				handler: this.logout,
			},
			{
				path: '/user',
				method: 'get',
				handler: this.authenticate,
			},
			{
				path: '/user',
				method: 'put',
				handler: this.update,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async register(
		req: Request<{}, {}, UserRegisterRequestDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user, refreshToken } = await this.usersService.register(req.body);
			res.cookie('rf', refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.ok(res, { user });
		} catch (error) {
			next(error);
		}
	}

	async login(
		req: Request<{}, {}, UserLoginRequestDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user, refreshToken } = await this.usersService.login(req.body);
			res.cookie('rf', refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.ok(res, { user });
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			const { rf } = req.cookies;
			await this.usersService.logout(rf);
			res.clearCookie('rf');
			this.ok(res, {});
		} catch (error) {
			next(error);
		}
	}

	async refresh(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			const { rf } = req.cookies;
			const { user, refreshToken } = await this.usersService.refresh(rf);
			res.cookie('rf', refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.ok(res, { user });
		} catch (error) {
			next(error);
		}
	}

	async authenticate(req: Request<{}, {}, {}>, res: Response, next: NextFunction): Promise<void> {
		try {
			const { user } = await this.usersService.authenticate(req.userId);
			this.ok(res, { user });
		} catch (error) {
			next(error);
		}
	}

	async update(
		req: Request<{}, {}, UserUpdateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = await this.usersService.update(req.userId, req.body);
			this.ok(res, { user });
		} catch (error) {
			next(error);
		}
	}
}
