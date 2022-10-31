import { ContainerModule, interfaces } from 'inversify';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsControllerInterface } from './types/commentsController.interface';
import { CommentsServiceInterface } from './types/commentsService.interface';
import { TYPES } from '../types';

export const CommetnsModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<CommentsControllerInterface>(TYPES.CommentsController)
		.to(CommentsController)
		.inSingletonScope();
	bind<CommentsServiceInterface>(TYPES.CommentsService).to(CommentsService).inSingletonScope();
});
