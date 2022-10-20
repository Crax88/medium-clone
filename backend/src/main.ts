import { Container } from 'inversify';
import { App } from './app';
import { LoggerInterface } from './common/types/logger.interface';
import { LoggerService } from './shared/logger/logger.service';
import { TYPES } from './types';
export interface IBootsrapReturn {
	appContainer: Container;
	app: App;
}
async function bootstrap(): Promise<IBootsrapReturn> {
	const appContainer = new Container();
	appContainer.bind<App>(TYPES.Application).to(App).inSingletonScope();
	appContainer.bind<LoggerInterface>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
