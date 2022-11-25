import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../types';

import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TokensServiceInterface } from './types/tokens.service.interface';
import { TokensRepository } from './tokens.repository';
import { TokensService } from './tokens.service';

export const TokensModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TokensServiceInterface>(TYPES.TokenService).to(TokensService).inSingletonScope();
	bind<TokensRepositoryInterface>(TYPES.TokenRepository).to(TokensRepository).inSingletonScope();
});
