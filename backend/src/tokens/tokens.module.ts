import { ContainerModule, interfaces } from 'inversify';
import { TokensService } from './tokens.service';
import { TokensServiceInterface } from './types/tokensService.interface';
import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TokensRepository } from './tokens.repository';
import { TYPES } from '../types';

export const TokensModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TokensServiceInterface>(TYPES.TokenService).to(TokensService).inSingletonScope();
	bind<TokensRepositoryInterface>(TYPES.TokenRepository).to(TokensRepository).inSingletonScope();
});
