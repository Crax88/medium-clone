import { DeleteResult } from 'typeorm';
import { Token } from '../token.entity';

export interface TokensRepositoryInterface {
	saveToken: (userId: number, token: string) => Promise<Token>;
	deleteToken: (token: string) => Promise<DeleteResult>;
	findToken: (token: string) => Promise<Token | null>;
}
