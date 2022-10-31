import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../common/base.controller';

export interface CommentsControllerInterface extends BaseController {
	createComment: (
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	deleteComment: (
		req: Request<{ slug: string; id: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	getComments: (req: Request<{ slug: string }>, res: Response, next: NextFunction) => Promise<void>;
}
