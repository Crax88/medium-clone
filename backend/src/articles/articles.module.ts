import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../types';

import { ArticlesControllerInterface } from './types/articles.controller.interface';
import { ArticlesRepositoryInterface } from './types/articles.repository.interface';
import { ArticlesServiceInterface } from './types/articles.service.interface';
import { ArticlesContoller } from './articles.controller';
import { ArticlesRepository } from './articles.repository';
import { ArticlesService } from './articles.service';

export const ArticlesModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<ArticlesControllerInterface>(TYPES.ArticlesController)
		.to(ArticlesContoller)
		.inSingletonScope();
	bind<ArticlesServiceInterface>(TYPES.ArticlesService).to(ArticlesService).inSingletonScope();
	bind<ArticlesRepositoryInterface>(TYPES.ArticlesRepository)
		.to(ArticlesRepository)
		.inSingletonScope();
});
