import { NextFunction, Request, Response } from 'express';

import { BaseController } from '../../common/base.controller';

export interface ProfilesControllerInterface extends BaseController {
	getProfile: (
		req: Request<{ username: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	followProfile: (
		req: Request<{ username: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	unfollowProfile: (
		req: Request<{ username: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
}
