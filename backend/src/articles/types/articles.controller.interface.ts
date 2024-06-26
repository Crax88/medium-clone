import { NextFunction, Request, Response } from 'express';

import { BaseController } from '../../common/base.controller';

export interface ArticlesControllerInterface extends BaseController {
	getArticles: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getFeed: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getArticle: (req: Request<{ slug: string }>, res: Response, next: NextFunction) => Promise<void>;
	createArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	updateArticle: (
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	deleteArticle: (
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	favoriteArticle: (
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	unfavoriteArticle: (
		req: Request<{ slug: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
}
