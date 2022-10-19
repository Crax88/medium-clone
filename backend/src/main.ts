import { Container } from 'inversify';
import { App } from './app';
export interface IBootsrapReturn {
	appContainer: Container;
	app: App;
}
async function bootstrap(): Promise<IBootsrapReturn> {
	const appContainer = new Container();
	appContainer.bind<App>('APP').to(App).inSingletonScope();
	const app = appContainer.get<App>('APP');
	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
