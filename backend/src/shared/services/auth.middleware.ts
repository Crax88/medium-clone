import { inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from '../../common/types/middleware.interface';
import { TokensServiceInterface } from '../../tokens/types/tokens.service.interface';
import { TYPES } from '../../types';

export class AuthMiddleware implements MiddlewareInterface {
	constructor(@inject(TYPES.TokenService) private tokensService: TokensServiceInterface) {}

	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			if (req.headers.authorization) {
				const token = req.headers.authorization.split(' ')[1];
				const tokenData = this.tokensService.validateAccessToken(token);
				if (tokenData) {
					req.userId = tokenData.userId;
				}
			}
			next();
		} catch (error) {
			next();
		}
	}
}
