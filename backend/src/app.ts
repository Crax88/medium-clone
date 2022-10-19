import 'reflect-metadata';
import { injectable } from 'inversify';
import { Server } from 'node:http';
import express, { Express } from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

@injectable()
export class App {
	private app: Express;
	private port: number;
	private server: Server;

	constructor() {
		this.app = express();
		this.port = 4000;
	}

	async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port, () => {
			console.log(`Server started on port ${this.port}`);
		});
		process.on('uncaughtException', (err) => {
			console.log(`Error ${err.message}`);
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
