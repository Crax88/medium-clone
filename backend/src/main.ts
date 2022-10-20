import { Container } from 'inversify';
import { App } from './app';
import { ExceptionFilterInterface } from './common/types/exceptionFilter.interface';
import { LoggerInterface } from './common/types/logger.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { ConfigService } from './shared/services/config.service';
import { LoggerService } from './shared/services/logger.service';
import { TypeormService } from './shared/services/typeorm.service';
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
	appContainer.bind<TypeormService>(TYPES.DatabaseService).to(TypeormService).inSingletonScope();

	const app = appContainer.get<App>(TYPES.Application);

	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
