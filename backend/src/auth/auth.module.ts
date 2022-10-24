import { ContainerModule, interfaces } from 'inversify';
import { AuthController } from './auth.controller';
import { AuthControllerInterface } from './types/authController.interface';
import { TYPES } from '../types';

export const AuthModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<AuthControllerInterface>(TYPES.AuthController).to(AuthController);
});
