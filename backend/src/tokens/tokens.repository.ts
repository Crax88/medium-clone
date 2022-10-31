import { inject, injectable } from 'inversify';
import { DeleteResult, Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Token } from './token.entity';
import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TYPES } from '../types';

@injectable()
export class TokensRepository implements TokensRepositoryInterface {
	private repository: Repository<Token>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Token);
	}

	async saveToken(userId: number, token: string): Promise<Token> {
		const newToken = this.repository.create({ userId, token });
		await this.repository.save(newToken);
		return newToken;
	}

	async deleteToken(token: string): Promise<DeleteResult> {
		return await this.repository.delete({ token });
	}

	async findToken(token: string): Promise<Token | null> {
		return await this.repository.findOneBy({ token });
	}
}
