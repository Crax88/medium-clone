import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../types';

import { ProfilesControllerInterface } from './types/profiles.controller.interface';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { ProfilesServiceInterface } from './types/profiles.service.interface';
import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.respository';
import { ProfilesService } from './profiles.service';

export const ProfilesModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<ProfilesControllerInterface>(TYPES.ProfilesController)
		.to(ProfilesController)
		.inSingletonScope();
	bind<ProfilesServiceInterface>(TYPES.ProfilesService).to(ProfilesService).inSingletonScope();
	bind<ProfilesRepositoryInterface>(TYPES.ProfilesRepository)
		.to(ProfilesRepository)
		.inSingletonScope();
});
