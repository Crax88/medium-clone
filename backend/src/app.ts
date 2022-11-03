import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Server } from 'node:http';
import express, { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import { LoggerInterface } from './common/types/logger.interface';
import { ConfigInterface } from './common/types/config.interface';
import { ExceptionFilterInterface } from './common/types/exceptionFilter.interface';
import { TypeormService } from './shared/services/typeorm.service';
import { UsersControllerInterface } from './users/types/users.controller.interface';
import { AuthMiddleware } from './shared/services/auth.middleware';
import { TokensServiceInterface } from './tokens/types/tokens.service.interface';
import { ArticlesControllerInterface } from './articles/types/articles.controller.interface';
import { TagsControllerInterface } from './tags/types/tags.controller.interface';
import { ProfilesControllerInterface } from './profiles/types/profiles.controller.interface';
import { CommentsControllerInterface } from './comments/types/comments.controller.interface';
import { TYPES } from './types';

@injectable()
export class App {
	private app: Express;
	private port: number;
	private server: Server;

	constructor(
		@inject(TYPES.LoggerService) private loggerService: LoggerInterface,
		@inject(TYPES.ConfigService) private configService: ConfigInterface,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
		@inject(TYPES.DatabaseService) private databaseService: TypeormService,
		@inject(TYPES.UsersController) private usersController: UsersControllerInterface,
		@inject(TYPES.ArticlesController) private articlesController: ArticlesControllerInterface,
		@inject(TYPES.TokenService) private tokensService: TokensServiceInterface,
		@inject(TYPES.TagsController) private tagsController: TagsControllerInterface,
		@inject(TYPES.ProfilesController) private profilesController: ProfilesControllerInterface,
		@inject(TYPES.CommentsController) private commentsController: CommentsControllerInterface,
	) {
		this.port = Number(this.configService.get('PORT'));
		this.app = express();
	}

	async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		await this.databaseService.connect();
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
		this.app.use(helmet());
		this.app.use(
			rateLimit({
				windowMs: 15 * 60 * 1000,
				max: 100,
				standardHeaders: true,
				legacyHeaders: false,
			}),
		);
		const authMiddleware = new AuthMiddleware(this.tokensService);
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	private useRoutes(): void {
		this.app.use('/api', this.usersController.router);
		this.app.use('/api', this.articlesController.router);
		this.app.use('/api', this.tagsController.router);
		this.app.use('/api', this.tagsController.router);
		this.app.use('/api', this.profilesController.router);
		this.app.use('/api', this.commentsController.router);
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
