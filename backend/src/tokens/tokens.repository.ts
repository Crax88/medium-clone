import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Token } from './token.entity';
import { TokensRepositoryInterface } from './types/tokensRepository.interface';
import { TYPES } from '../types';

@injectable()
export class TokensRepository implements TokensRepositoryInterface {
	private repository: Repository<Token>;

	constructor(@inject(TYPES.DatabaseService) dataBaseService: TypeormService) {
		this.repository = dataBaseService.getRepository(Token);
	}

	async saveToken(userId: number, token: string): Promise<Token> {
		const newToken = this.repository.create({ userId, token });
		await this.repository.save(newToken);
		return newToken;
	}

	async findToken(token: string): Promise<Token | null> {
		const savedToken = await this.repository.findOne({ where: { token } });
		return savedToken;
	}

	async removeToken(token: string): Promise<void> {
		await this.repository.delete({ token });
	}
}
