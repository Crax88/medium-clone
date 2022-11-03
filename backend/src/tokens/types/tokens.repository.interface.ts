import { TokenDto } from './tokens.dto';

export interface TokensRepositoryInterface {
	saveToken: (userId: number, token: string) => Promise<void>;
	deleteToken: (token: string) => Promise<void>;
	findToken: (token: string) => Promise<TokenDto | null>;
}
