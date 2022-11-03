import 'reflect-metadata';
import { Container } from 'inversify';
import { ConfigInterface } from '../common/types/config.interface';
import { TokensRepositoryInterface } from './types/tokens.repository.interface';
import { TokensServiceInterface } from './types/tokens.service.interface';
import { TokensService } from './tokens.service';
import { TYPES } from '../types';

const ConfigServiceMock: ConfigInterface = {
	get: jest.fn(),
};
const TokenRepositoryMock: TokensRepositoryInterface = {
	findToken: jest.fn(),
	saveToken: jest.fn(),
	deleteToken: jest.fn(),
};

const container = new Container();
let configService: ConfigInterface;
let tokenRepository: TokensRepositoryInterface;
let tokenService: TokensServiceInterface;

beforeAll(() => {
	container.bind<TokensServiceInterface>(TYPES.TokenService).to(TokensService);
	container.bind<ConfigInterface>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container
		.bind<TokensRepositoryInterface>(TYPES.TokenRepository)
		.toConstantValue(TokenRepositoryMock);

	configService = container.get<ConfigInterface>(TYPES.ConfigService);
	tokenRepository = container.get<TokensRepositoryInterface>(TYPES.TokenRepository);
	tokenService = container.get<TokensServiceInterface>(TYPES.TokenService);
});

describe('TokenService', () => {
	it('Generates tokens', () => {
		configService.get = jest.fn().mockImplementation((key) => {
			if (key === 'ACCESS_TOKEN_EXPIRES' || key === 'REFRESH_TOKEN_EXPIRES') {
				return '2d';
			}
			if (key === 'ACCESS_TOKEN_SECRET' || key === 'REFRESH_TOKEN_SECRET') {
				return 'secret';
			}
		});

		const tokens = tokenService.generateTokens({ userId: 1 });
		expect(tokens).toHaveProperty('accessToken');
		expect(tokens).toHaveProperty('refreshToken');
	});

	it('Returns accessToken payload', () => {
		configService.get = jest.fn().mockImplementation((key) => {
			if (key === 'ACCESS_TOKEN_EXPIRES' || key === 'REFRESH_TOKEN_EXPIRES') {
				return '2d';
			}
			if (key === 'ACCESS_TOKEN_SECRET' || key === 'REFRESH_TOKEN_SECRET') {
				return 'secret';
			}
		});
		const payload = { userId: 1 };
		const tokens = tokenService.generateTokens(payload);
		const decoded = tokenService.validateAccessToken(tokens.accessToken);
		expect(decoded).toBeTruthy();
		expect(decoded?.userId).toEqual(payload.userId);
	});

	it('Returns refreshToken payload', () => {
		configService.get = jest.fn().mockImplementation((key) => {
			if (key === 'ACCESS_TOKEN_EXPIRES' || key === 'REFRESH_TOKEN_EXPIRES') {
				return '2d';
			}
			if (key === 'ACCESS_TOKEN_SECRET' || key === 'REFRESH_TOKEN_SECRET') {
				return 'secret';
			}
		});
		const payload = { userId: 1 };
		const tokens = tokenService.generateTokens(payload);
		const decoded = tokenService.validateRefreshToken(tokens.refreshToken);
		expect(decoded).toBeTruthy();
		expect(decoded?.userId).toEqual(payload.userId);
	});

	it('Returns null if token is not valid', () => {
		configService.get = jest.fn().mockImplementation((key) => {
			if (key === 'ACCESS_TOKEN_EXPIRES' || key === 'REFRESH_TOKEN_EXPIRES') {
				return '2d';
			}
			if (key === 'ACCESS_TOKEN_SECRET' || key === 'REFRESH_TOKEN_SECRET') {
				return 'secret';
			}
		});
		const payload = { userId: 1 };
		const tokens = tokenService.generateTokens(payload);
		configService.get = jest.fn().mockReturnValueOnce('wrongSecret');
		const decodedRefreshToken = tokenService.validateRefreshToken(tokens.refreshToken);
		const decodedAccessToken = tokenService.validateAccessToken(tokens.accessToken);
		expect(decodedRefreshToken).toBeNull();
		expect(decodedAccessToken).toBeNull();
	});

	it('Saves token', async () => {
		tokenRepository.saveToken = jest.fn().mockImplementationOnce((userId, token) => {
			return;
		});
		const userId = 1;
		const token = 'fhdshfkdhsfhdskfd';
		await tokenService.saveToken(userId, token);

		expect(tokenRepository.saveToken).toBeCalledTimes(1);
		expect(tokenRepository.saveToken).toBeCalledWith(userId, token);
	});

	it('Finds token', async () => {
		tokenRepository.findToken = jest.fn().mockImplementationOnce((token) => {
			return {
				id: 1,
				token,
				userId: 1,
			};
		});
		const token = 'nfdhdshfds';
		const foundToken = await tokenService.findToken(token);
		expect(foundToken).not.toBe(null);
		expect(foundToken).toHaveProperty('id');
		expect(foundToken).toHaveProperty('token');
		expect(foundToken?.token).toEqual(token);
		expect(foundToken?.token).not.toEqual(null);
		expect(foundToken?.userId).not.toEqual(null);
	});

	it('Removes token', async () => {
		tokenRepository.deleteToken = jest.fn().mockImplementationOnce((token) => {
			return;
		});

		const token = 'fdfdsfdsfds';
		await tokenService.removeToken(token);

		expect(tokenRepository.deleteToken).toHaveBeenCalledTimes(1);
		expect(tokenRepository.deleteToken).toHaveBeenCalledWith(token);
	});
});
