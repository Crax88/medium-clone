import { ContainerModule, interfaces } from 'inversify';
import { TokensService } from './tokens.service';
import { TokensServiceInterface } from './types/tokensService.interface';
import { TYPES } from '../types';

export const TokensModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<TokensServiceInterface>(TYPES.TokenService).to(TokensService).inSingletonScope();
});
