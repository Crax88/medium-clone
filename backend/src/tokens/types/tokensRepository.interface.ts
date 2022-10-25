import { Token } from '../token.entity';

export interface TokensRepositoryInterface {
	saveToken: (userId: number, token: string) => Promise<Token>;
	removeToken: (token: string) => Promise<void>;
	findToken: (token: string) => Promise<Token | null>;
}
