import { inject, injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import { ConfigInterface } from '../common/types/config.interface';
import { TokensRepositoryInterface } from './types/tokensRepository.interface';
import { TokensServiceInterface } from './types/tokensService.interface';
import { TokenPayloadDto } from './types/tokenPayload.dto';
import { TokensDto } from './types/tokens.dto';
import { TYPES } from '../types';
import { Token } from './token.entity';

@injectable()
export class TokensService implements TokensServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigInterface,
		@inject(TYPES.TokenRepository) private tokenRepository: TokensRepositoryInterface,
	) {}

	generateTokens(payload: TokenPayloadDto): TokensDto {
		const accessToken = sign(payload, this.configService.get('ACCESS_TOKEN_SECRET'), {
			expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES'),
		});
		const refreshToken = sign(payload, this.configService.get('REFRESH_TOKEN_SECRET'), {
			expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES'),
		});
		return { accessToken, refreshToken };
	}

	validateAccessToken(token: string): TokenPayloadDto | null {
		try {
			const decoded = verify(token, this.configService.get('ACCESS_TOKEN_SECRET'));
			return decoded as TokenPayloadDto;
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(token: string): TokenPayloadDto | null {
		try {
			const decoded = verify(token, this.configService.get('REFRESH_TOKEN_SECRET'));
			return decoded as TokenPayloadDto;
		} catch (error) {
			return null;
		}
	}

	async saveToken(userId: number, token: string): Promise<Token> {
		const savedToken = await this.tokenRepository.saveToken(userId, token);
		return savedToken;
	}

	async removeToken(token: string): Promise<void> {
		await this.tokenRepository.removeToken(token);
	}

	async findToken(token: string): Promise<Token | null> {
		const foundToken = await this.tokenRepository.findToken(token);
		return foundToken;
	}
}
