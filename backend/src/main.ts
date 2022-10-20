import { Container } from 'inversify';
import { App } from './app';
import { LoggerInterface } from './common/types/logger.interface';
import { ConfigService } from './shared/services/config.service';
import { LoggerService } from './shared/services/logger.service';
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
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
