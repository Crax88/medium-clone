import { inject, injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import { ConfigInterface } from '../common/types/config.interface';
import { TokensServiceInterface } from './types/tokens.service.interface';
import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TokenPayloadDto } from './types/tokenPayload.dto';
import { TokenDto, TokensDto } from './types/tokens.dto';
import { TYPES } from '../types';

@injectable()
export class TokensService implements TokensServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigInterface,
		@inject(TYPES.TokenRepository) private tokensRepository: TokensRepositoryInterface,
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

	async saveToken(userId: number, token: string): Promise<void> {
		await this.tokensRepository.saveToken(userId, token);
	}

	async removeToken(token: string): Promise<void> {
		await this.tokensRepository.deleteToken(token);
	}

	async findToken(token: string): Promise<TokenDto | null> {
		const foundToken = await this.tokensRepository.findToken(token);
		return foundToken;
	}
}
