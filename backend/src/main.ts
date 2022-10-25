import { Container } from 'inversify';
import { App } from './app';
import { AuthModule } from './auth/auth.module';
import { ExceptionFilterInterface } from './common/types/exceptionFilter.interface';
import { LoggerInterface } from './common/types/logger.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { TokensModule } from './tokens/tokens.module';
import { TYPES } from './types';
export interface IBootsrapReturn {
	appContainer: Container;
	app: App;
}
async function bootstrap(): Promise<IBootsrapReturn> {
	const appContainer = new Container();
	appContainer.bind<App>(TYPES.Application).to(App).inSingletonScope();
	appContainer.bind<LoggerInterface>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	appContainer.bind<ConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	appContainer
		.bind<ExceptionFilterInterface>(TYPES.ExceptionFilter)
		.to(ExceptionFilter)
		.inSingletonScope();
	appContainer.load(TokensModule);
	appContainer.load(AuthModule);

	const app = appContainer.get<App>(TYPES.Application);

	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
