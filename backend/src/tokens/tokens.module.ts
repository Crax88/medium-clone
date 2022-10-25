import { ContainerModule, interfaces } from 'inversify';
import { TokensRepository } from './tokens.repository';
import { TokensService } from './tokens.service';
import { TokensRepositoryInterface } from './types/tokensRepository.interface';
import { TokensServiceInterface } from './types/tokensService.interface';
import { TYPES } from '../types';

export const TokensModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TokensRepositoryInterface>(TYPES.TokenRepository).to(TokensRepository).inSingletonScope();
	bind<TokensServiceInterface>(TYPES.TokenService).to(TokensService).inSingletonScope();
});
