import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { Token } from './token.entity';
import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TYPES } from '../types';
import { TokenDto } from './types/tokens.dto';

@injectable()
export class TokensRepository implements TokensRepositoryInterface {
	private repository: Repository<Token>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(Token);
	}

	async saveToken(userId: number, token: string): Promise<void> {
		const newToken = this.repository.create({ userId, token });
		await this.repository.save(newToken);
	}

	async deleteToken(token: string): Promise<void> {
		await this.repository.delete({ token });
	}

	async findToken(token: string): Promise<TokenDto | null> {
		return await this.repository.findOneBy({ token });
	}
}
