import { NextFunction, Request, Response, Router } from 'express';

import { MiddlewareInterface } from './middleware.interface';

export interface RouteInterface {
	path: string;
	handler: (req: Request<any>, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: MiddlewareInterface[];
}

export type ExpressReturnType = Response<unknown, Record<string, unknown>>;
