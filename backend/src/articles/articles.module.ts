import { ContainerModule, interfaces } from 'inversify';
import { ArticlesContoller } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticlesControllerInterface } from './types/articlesController.interface';
import { ArticlesServiceInterface } from './types/articlesService.interface';
import { TYPES } from '../types';

export const ArticlesModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<ArticlesControllerInterface>(TYPES.ArticlesController)
		.to(ArticlesContoller)
		.inSingletonScope();
	bind<ArticlesServiceInterface>(TYPES.ArticlesService).to(ArticlesService).inSingletonScope();
});
