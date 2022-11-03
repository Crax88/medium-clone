import { ContainerModule, interfaces } from 'inversify';
import { TokensService } from './tokens.service';
import { TokensRepository } from './tokens.repository';
import { TokensServiceInterface } from './types/tokens.service.interface';
import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TYPES } from '../types';

export const TokensModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TokensServiceInterface>(TYPES.TokenService).to(TokensService).inSingletonScope();
	bind<TokensRepositoryInterface>(TYPES.TokenRepository).to(TokensRepository).inSingletonScope();
});
