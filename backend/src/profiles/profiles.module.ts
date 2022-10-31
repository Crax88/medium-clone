import { ContainerModule, interfaces } from 'inversify';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ProfilesRepository } from './profiles.respository';
import { ProfilesControllerInterface } from './types/profilesController.interface';
import { ProfilesServiceInterface } from './types/profilesService.interface';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { TYPES } from '../types';

export const ProfilesModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<ProfilesControllerInterface>(TYPES.ProfilesController)
		.to(ProfilesController)
		.inSingletonScope();
	bind<ProfilesServiceInterface>(TYPES.ProfilesService).to(ProfilesService).inSingletonScope();
	bind<ProfilesRepositoryInterface>(TYPES.ProfilesRepository)
		.to(ProfilesRepository)
		.inSingletonScope();
});
