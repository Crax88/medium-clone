import { NextFunction, Request, Response } from 'express';

import { BaseController } from '../../common/base.controller';

export interface TagsControllerInterface extends BaseController {
	getPopularTags: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
