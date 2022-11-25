import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../types';

import { TagsControllerInterface } from './types/tags.controller.interface';
import { TagsRepositoryInterface } from './types/tags.repository.interface';
import { TagsServiceInterface } from './types/tags.service.interface';
import { TagsController } from './tags.controller';
import { TagsRepository } from './tags.repository';
import { TagsService } from './tags.service';

export const TagsModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TagsServiceInterface>(TYPES.TagsService).to(TagsService).inSingletonScope();
	bind<TagsControllerInterface>(TYPES.TagsController).to(TagsController).inSingletonScope();
	bind<TagsRepositoryInterface>(TYPES.TagsRepository).to(TagsRepository).inSingletonScope();
});
