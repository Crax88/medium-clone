import { ContainerModule, interfaces } from 'inversify';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagsRepository } from './tags.repository';
import { TagsControllerInterface } from './types/tagsController.interface';
import { TagsServiceInterface } from './types/tagsService.interface';
import { TagsRepositoryInterface } from './types/tags.repository.interface';
import { TYPES } from '../types';

export const TagsModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TagsServiceInterface>(TYPES.TagsService).to(TagsService).inSingletonScope();
	bind<TagsControllerInterface>(TYPES.TagsController).to(TagsController).inSingletonScope();
	bind<TagsRepositoryInterface>(TYPES.TagsRepository).to(TagsRepository).inSingletonScope();
});
