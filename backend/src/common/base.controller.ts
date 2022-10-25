import 'reflect-metadata';
import { injectable } from 'inversify';
import { Router, Response } from 'express';
import { RouteInterface, ExpressReturnType } from './types/route.interface';
import { LoggerInterface } from './types/logger.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private loggerService: LoggerInterface) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected send<T>(res: Response, code: number, data: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(data);
	}

	protected ok<T>(res: Response, data: T): ExpressReturnType {
		return this.send<T>(res, 200, data);
	}

	protected created<T>(res: Response, data: T): ExpressReturnType {
		return this.send<T>(res, 201, data);
	}

	protected bindRoutes(routes: RouteInterface[]): void {
		for (const route of routes) {
			const routePath = `${route.path}`.replace(/\/$/, '');
			this.loggerService.info(`[${route.method}] ${routePath}`);
			const middleware = route?.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.handler.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
