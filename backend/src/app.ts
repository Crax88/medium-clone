import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Server } from 'node:http';
import express, { Express } from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { TYPES } from './types';
import { LoggerInterface } from './common/types/logger.interface';

@injectable()
export class App {
	private app: Express;
	private port: number;
	private server: Server;

	constructor(@inject(TYPES.LoggerService) private loggerService: LoggerInterface) {
		this.app = express();
		this.port = 4000;
	}

	async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port, () => {
			this.loggerService.info(`[App] Server started on port ${this.port}`);
		});
		process.on('uncaughtException', (err) => {
			this.loggerService.error(`[App] Uncaught exception ${err.message}`, err);
		});
	}

	close(): void {
		this.server.close();
	}

	private useMiddlewares(): void {
		this.app.use(json());
		this.app.use(cookieParser());
	}

	private useRoutes(): void {
		console.log('Bindind routes');
	}

	private useExceptionFilters(): void {
		console.log('Bind error middleware');
	}
}
