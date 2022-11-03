import 'reflect-metadata';
import { Container } from 'inversify';
import { hash } from 'bcryptjs';
import { UsersService } from './users.service';
import { ConfigInterface } from '../common/types/config.interface';
import { UsersServiceInterface } from './types/users.service.interface';
import { UsersRepositoryInterface } from './types/users.repository.interface';
import { TokensServiceInterface } from '../tokens/types/tokens.service.interface';
import { HttpError } from '../errors/httpError';
import { TYPES } from '../types';

const ConfigServiceMock: ConfigInterface = {
	get: jest.fn(),
};
const TokenServiceMock: TokensServiceInterface = {
	generateTokens: jest.fn(),
	validateAccessToken: jest.fn(),
	validateRefreshToken: jest.fn(),
	saveToken: jest.fn(),
	removeToken: jest.fn(),
	findToken: jest.fn(),
};

const UsersRepositoryMock: UsersRepositoryInterface = {
	createUser: jest.fn(),
	findUser: jest.fn(),
	updateUser: jest.fn(),
};

const container = new Container();
let configService: ConfigInterface;
let tokenService: TokensServiceInterface;
let usersService: UsersServiceInterface;
let usersRepository: UsersRepositoryInterface;

beforeAll(() => {
	container.bind<UsersServiceInterface>(TYPES.UsersService).to(UsersService);
	container.bind<ConfigInterface>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<TokensServiceInterface>(TYPES.TokenService).toConstantValue(TokenServiceMock);
	container
		.bind<UsersRepositoryInterface>(TYPES.UsersRepository)
		.toConstantValue(UsersRepositoryMock);

	configService = container.get<ConfigInterface>(TYPES.ConfigService);
	tokenService = container.get<TokensServiceInterface>(TYPES.TokenService);
	usersService = container.get<UsersServiceInterface>(TYPES.UsersService);
	usersRepository = container.get<UsersRepositoryInterface>(TYPES.UsersRepository);
});

describe('UsersService', () => {
	it('Registers new user', async () => {
		usersRepository.createUser = jest.fn().mockImplementationOnce((dto) => ({
			id: 1,
			email: dto.email,
			username: dto.username,
			password: 'fdfdslfldsjfklds',
		}));

		const accessToken = 'accesTokenHash';
		const refreshToken = 'resfreshTokenHash';

		tokenService.generateTokens = jest.fn().mockImplementationOnce((payload) => ({
			accessToken,
			refreshToken,
		}));

		tokenService.saveToken = jest
			.fn()
			.mockImplementationOnce((userId, token) => ({ id: 1, userId, token }));

		const userData = { username: 'user', email: 'user@test.com', password: '12345' };
		const registerResult = await usersService.register(userData);
		expect(registerResult.user.username).toEqual('user');
		expect(registerResult.user.email).toEqual(userData.email);
		expect(registerResult.user.username).toEqual(userData.username);
		expect(registerResult.user.token).toEqual(accessToken);
		expect(registerResult.refreshToken).toEqual(refreshToken);
		expect(registerResult.user).not.toHaveProperty('password');
	});

	it('Register new user, Throws if user already exists', async () => {
		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => {
			return {
				id: 1,
				username: 'user',
				email: 'user@mail.com',
			};
		});

		const userData = { username: 'user', email: 'user@test.com', password: '12345' };
		expect(async () => {
			await usersService.register(userData);
		}).rejects.toThrow(HttpError);
	});

	it('Login user', async () => {
		const password = '12345';
		const hashedPassword = await hash(password, 10);

		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => ({
			id: 1,
			email: dto.email,
			username: 'user',
			password: hashedPassword,
		}));

		const accessToken = 'accesTokenHash';
		const refreshToken = 'resfreshTokenHash';

		tokenService.generateTokens = jest.fn().mockImplementationOnce((payload) => ({
			accessToken,
			refreshToken,
		}));

		tokenService.saveToken = jest
			.fn()
			.mockImplementationOnce((userId, token) => ({ id: 1, userId, token }));

		const userData = { email: 'user@test.com', password };
		const loginResult = await usersService.login(userData);
		expect(loginResult.user.username).toEqual('user');
		expect(loginResult.user.email).toEqual(userData.email);
		expect(loginResult.user.token).toEqual(accessToken);
		expect(loginResult.refreshToken).toEqual(refreshToken);
		expect(loginResult.user).not.toHaveProperty('password');
	});

	it('Login user, Throws if user not found', async () => {
		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => {
			return null;
		});

		const userData = { email: 'user@test.com', password: '12345' };
		expect(async () => {
			await usersService.login(userData);
		}).rejects.toThrow(HttpError);
	});

	it('Login user, Throws if passwords do not match', async () => {
		const password = '12345';
		const hashedPassword = await hash(password, 10);

		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => ({
			id: 1,
			email: dto.email,
			username: 'user',
			password: hashedPassword,
		}));

		const userData = { email: 'user@test.com', password: 'wrongPassword' };
		expect(async () => {
			await usersService.login(userData);
		}).rejects.toThrow(HttpError);
	});

	it('Logouts user', async () => {
		tokenService.removeToken = jest.fn().mockImplementationOnce(() => {
			return;
		});
		const token = 'token';
		await usersService.logout(token);
		expect(tokenService.removeToken).toBeCalledTimes(1);
		expect(tokenService.removeToken).toBeCalledWith(token);
	});

	it('Update user', async () => {
		const password = '12345';
		const hashedPassword = await hash(password, 10);

		usersRepository.findUser = jest.fn().mockImplementation((dto) => {
			if (dto.email) {
				return {
					id: 1,
					email: 'user@email.com',
					username: 'user',
					password: hashedPassword,
				};
			}
			return {
				id: 1,
				email: 'user@test.com',
				username: 'user1',
				password: hashedPassword,
			};
		});

		usersRepository.updateUser = jest.fn().mockImplementationOnce((dto) => ({
			affected: 1,
		}));

		const accessToken = 'accesTokenHash';
		const refreshToken = 'resfreshTokenHash';

		tokenService.generateTokens = jest.fn().mockImplementationOnce((payload) => ({
			accessToken,
			refreshToken,
		}));

		tokenService.saveToken = jest
			.fn()
			.mockImplementationOnce((userId, token) => ({ id: 1, userId, token }));

		const userData = { email: 'user@test.com', password: '54321', username: 'user1' };
		const updateResult = await usersService.update(1, userData);
		expect(updateResult.user.username).toEqual(userData.username);
		expect(updateResult.user.email).toEqual(userData.email);
		expect(updateResult.user.token).toEqual(accessToken);
		expect(updateResult.refreshToken).toEqual(refreshToken);
		expect(updateResult.user).not.toHaveProperty('password');
	});

	it('Update user, Throws if user not found', async () => {
		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => {
			return null;
		});

		const userData = { email: 'user@test.com', username: 'user1' };
		expect(async () => {
			await usersService.update(1, userData);
		}).rejects.toThrow(HttpError);
	});

	it('Authenticate user', async () => {
		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => ({
			id: 1,
			email: 'user@mail.com',
			username: 'user',
			password: 'fdfds37329847',
		}));

		const accessToken = 'accesTokenHash';
		const refreshToken = 'resfreshTokenHash';

		tokenService.generateTokens = jest.fn().mockImplementationOnce((payload) => ({
			accessToken,
			refreshToken,
		}));

		tokenService.saveToken = jest
			.fn()
			.mockImplementationOnce((userId, token) => ({ id: 1, userId, token }));

		const authenticateResult = await usersService.authenticate(1);
		expect(authenticateResult.user.username).toEqual('user');
		expect(authenticateResult.user.email).toEqual('user@mail.com');
		expect(authenticateResult.user.token).toEqual(accessToken);
		expect(authenticateResult.refreshToken).toEqual(refreshToken);
		expect(authenticateResult.user).not.toHaveProperty('password');
	});

	it('Authenticate user, Throws if no user id', async () => {
		expect(async () => {
			await usersService.authenticate(0);
		}).rejects.toThrow(HttpError);
	});

	it('Authenticate user, Throws if user not found', async () => {
		usersRepository.findUser = jest.fn().mockImplementationOnce((dto) => {
			return null;
		});

		expect(async () => {
			await usersService.authenticate(1);
		}).rejects.toThrow(HttpError);
	});

	it('Refresh tokens', async () => {
		tokenService.validateRefreshToken = jest.fn().mockImplementationOnce((token) => ({
			id: 1,
			email: 'test@test.com',
			username: 'test',
		}));
		tokenService.findToken = jest.fn().mockImplementationOnce((token) => ({
			id: 1,
			userId: 1,
			token,
		}));
		tokenService.removeToken = jest.fn().mockImplementationOnce((token) => {
			return;
		});
		usersRepository.findUser = jest.fn().mockImplementationOnce((query) => ({
			id: 1,
			email: 'test@test.com',
			username: 'test',
			password: 'password',
		}));
		const accessToken = 'accesTokenHash';
		const refreshToken = 'resfreshTokenHash';

		tokenService.generateTokens = jest.fn().mockImplementationOnce((payload) => ({
			accessToken,
			refreshToken,
		}));
		tokenService.saveToken = jest
			.fn()
			.mockImplementationOnce((userId, token) => ({ id: 2, userId, token }));

		const refreshResult = await usersService.refresh('token');

		expect(refreshResult.user.email).toEqual('test@test.com');
		expect(refreshResult.user.username).toEqual('test');
		expect(refreshResult.user.token).toEqual(accessToken);
		expect(refreshResult.refreshToken).toEqual(refreshToken);
		expect(refreshResult.user).not.toHaveProperty('password');
	});

	it('Throws on refresh if no token provided', () => {
		expect(async () => {
			await usersService.refresh('');
		}).rejects.toThrow(HttpError);
	});

	it('Throws on refresh if token is not valid', () => {
		tokenService.validateRefreshToken = jest.fn().mockImplementationOnce((token) => {
			return null;
		});
		expect(async () => {
			await usersService.refresh('');
		}).rejects.toThrow(HttpError);
	});

	it('Throws on refresh if token is not found in DB', () => {
		tokenService.validateRefreshToken = jest.fn().mockImplementationOnce((token) => ({
			id: 1,
			email: 'test@test.com',
			username: 'test',
		}));
		tokenService.findToken = jest.fn().mockResolvedValueOnce(null);

		expect(async () => {
			await usersService.refresh('');
		}).rejects.toThrow(HttpError);
	});

	it('Throws on refresh if token user not found in DB', () => {
		tokenService.validateRefreshToken = jest.fn().mockImplementationOnce((token) => ({
			id: 1,
			email: 'test@test.com',
			username: 'test',
		}));
		tokenService.findToken = jest.fn().mockImplementationOnce((token) => ({
			id: 1,
			token,
			userId: 1,
		}));

		usersRepository.findUser = jest.fn().mockRejectedValueOnce(null);

		expect(async () => {
			await usersService.refresh('');
		}).rejects.toThrow(HttpError);
	});
});
