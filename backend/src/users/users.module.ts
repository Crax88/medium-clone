import { ContainerModule, interfaces } from 'inversify';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersControllerInterface } from './types/users.controller.interface';
import { UsersServiceInterface } from './types/users.service.interface';
import { UsersRepositoryInterface } from './types/users.repository.interface';
import { TYPES } from '../types';

export const UsersModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<UsersControllerInterface>(TYPES.UsersController).to(UsersController).inSingletonScope();
	bind<UsersServiceInterface>(TYPES.UsersService).to(UsersService).inSingletonScope();
	bind<UsersRepositoryInterface>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});
