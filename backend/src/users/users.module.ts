import { ContainerModule, interfaces } from 'inversify';
import { UsersControllerInterface } from './types/usersController.interface';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersServiceInterface } from './types/usersService.interface';
import { UsersService } from './users.service';
import { UsersRepositoryInterface } from './types/users.repository.interface';
import { TYPES } from '../types';

export const UsersModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<UsersControllerInterface>(TYPES.UsersController).to(UsersController).inSingletonScope();
	bind<UsersServiceInterface>(TYPES.UsersService).to(UsersService).inSingletonScope();
	bind<UsersRepositoryInterface>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
});
