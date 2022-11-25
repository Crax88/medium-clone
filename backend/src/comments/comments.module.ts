import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../types';

import { CommentsControllerInterface } from './types/comments.controller.interface';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { CommentsServiceInterface } from './types/comments.service.interface';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.respository';
import { CommentsService } from './comments.service';

export const CommetnsModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<CommentsControllerInterface>(TYPES.CommentsController)
		.to(CommentsController)
		.inSingletonScope();
	bind<CommentsServiceInterface>(TYPES.CommentsService).to(CommentsService).inSingletonScope();
	bind<CommentsRepositoryInterface>(TYPES.CommentsRepository)
		.to(CommentsRepository)
		.inSingletonScope();
});
