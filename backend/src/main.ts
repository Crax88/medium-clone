import { Container } from 'inversify';
import { App } from './app';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { SharedModule } from './shared/shared.module';
import { ExceptionFilter } from './errors/exception.filter';
import { ExceptionFilterInterface } from './common/types/exceptionFilter.interface';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CommetnsModule } from './comments/comments.module';
import { TYPES } from './types';
export interface IBootsrapReturn {
	appContainer: Container;
	app: App;
}
async function bootstrap(): Promise<IBootsrapReturn> {
	const appContainer = new Container();
	appContainer.bind<App>(TYPES.Application).to(App).inSingletonScope();
	appContainer
		.bind<ExceptionFilterInterface>(TYPES.ExceptionFilter)
		.to(ExceptionFilter)
		.inSingletonScope();
	appContainer.load(
		UsersModule,
		TokensModule,
		SharedModule,
		ArticlesModule,
		TagsModule,
		ProfilesModule,
		CommetnsModule,
	);

	const app = appContainer.get<App>(TYPES.Application);

	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
