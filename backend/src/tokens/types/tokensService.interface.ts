import { Token } from '../token.entity';
import { TokenPayloadDto } from './tokenPayload.dto';
import { TokensDto } from './tokens.dto';

export interface TokensServiceInterface {
	generateTokens: (payload: TokenPayloadDto) => TokensDto;
	validateAccessToken: (token: string) => TokenPayloadDto | null;
	validateRefreshToken: (token: string) => TokenPayloadDto | null;
	saveToken: (userId: number, token: string) => Promise<Token>;
	removeToken: (token: string) => Promise<void>;
	findToken: (token: string) => Promise<Token | null>;
}
