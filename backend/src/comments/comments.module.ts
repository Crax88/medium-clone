import { ContainerModule, interfaces } from 'inversify';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.respository';
import { CommentsControllerInterface } from './types/comments.controller.interface';
import { CommentsServiceInterface } from './types/comments.service.interface';
import { CommentsRepositoryInterface } from './types/comments.repository.interface';
import { TYPES } from '../types';

export const CommetnsModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<CommentsControllerInterface>(TYPES.CommentsController)
		.to(CommentsController)
		.inSingletonScope();
	bind<CommentsServiceInterface>(TYPES.CommentsService).to(CommentsService).inSingletonScope();
	bind<CommentsRepositoryInterface>(TYPES.CommentsRepository)
		.to(CommentsRepository)
		.inSingletonScope();
});
