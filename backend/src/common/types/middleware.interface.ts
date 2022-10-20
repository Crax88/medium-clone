import { NextFunction, Response, Request } from 'express';

export interface MiddlewareInterface {
	execute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
