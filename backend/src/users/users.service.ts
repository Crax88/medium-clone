import { inject, injectable } from 'inversify';
import { hash, genSalt, compare } from 'bcryptjs';
import { ConfigInterface } from '../common/types/config.interface';
import { HttpError } from '../errors/httpError';
import { TokensServiceInterface } from '../tokens/types/tokensService.interface';
import { TYPES } from '../types';
import { AuthResponse } from './types/authResponse.interface';
import { UserLoginDto } from './types/userLogin.dto';
import { UserRegisterDto } from './types/userRegister.dto';
import { UsersRepositoryInterface } from './types/usersRepository.interface';
import { UsersServiceInterface } from './types/usersService.interface';
import { User } from './user.entity';

@injectable()
export class UsersService implements UsersServiceInterface {
	constructor(
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
		@inject(TYPES.ConfigService) private configService: ConfigInterface,
		@inject(TYPES.TokenService) private tokensService: TokensServiceInterface,
	) {}

	async register(dto: UserRegisterDto): Promise<AuthResponse> {
		let candidate = await this.usersRepository.findUser({
			email: dto.email,
		});
		if (candidate) {
			throw new HttpError(400, 'email already taken');
		}
		candidate = await this.usersRepository.findUser({
			username: dto.username,
		});
		if (candidate) {
			throw new HttpError(400, 'username already taken');
		}
		const salt = await genSalt(Number(this.configService.get('SALT')));
		const hashedPasword = await hash(dto.password, salt);
		dto.password = hashedPasword;
		const newUser = await this.usersRepository.createUser(dto);
		const tokens = this.tokensService.generateTokens({ userId: newUser.id });
		await this.tokensService.saveToken(newUser.id, tokens.refreshToken);
		return this.buildAuthResponse(newUser, tokens);
	}

	async login(dto: UserLoginDto): Promise<AuthResponse> {
		const user = await this.usersRepository.findUser({ email: dto.email });
		if (!user) {
			throw new HttpError(400, 'invalid email or password');
		}
		const isPasswordMatch = await compare(dto.password, user.password);
		if (!isPasswordMatch) {
			throw new HttpError(400, 'invalid email or password');
		}
		const tokens = this.tokensService.generateTokens({ userId: user.id });
		await this.tokensService.saveToken(user.id, tokens.refreshToken);
		return this.buildAuthResponse(user, tokens);
	}

	async refresh(token: string): Promise<AuthResponse> {
		if (!token) {
			throw new HttpError(401, 'unauthorized');
		}
		const tokenData = this.tokensService.validateRefreshToken(token);
		const savedToken = await this.tokensService.findToken(token);
		await this.tokensService.removeToken(token);
		if (!tokenData || !savedToken) {
			throw new HttpError(401, 'unauthorized');
		}
		const user = await this.usersRepository.findUser({ id: tokenData.userId });
		if (!user) {
			throw new HttpError(401, 'unauthorized');
		}
		const tokens = this.tokensService.generateTokens({ userId: user.id });
		await this.tokensService.saveToken(user.id, tokens.refreshToken);
		return this.buildAuthResponse(user, tokens);
	}

	async authenticate(id: number): Promise<AuthResponse> {
		if (!id) {
			throw new HttpError(401, 'unauthorized');
		}
		const user = await this.usersRepository.findUser({ id });
		if (!user) {
			throw new HttpError(401, 'unauthorized');
		}
		const tokens = this.tokensService.generateTokens({ userId: user.id });
		// await this.tokensService.saveToken(user.id, tokens.refreshToken);
		return this.buildAuthResponse(user, tokens);
	}

	async logout(token: string): Promise<void> {
		await this.tokensService.removeToken(token);
	}

	private buildAuthResponse(
		user: User,
		tokens: { refreshToken: string; accessToken: string },
	): AuthResponse {
		return {
			user: {
				email: user.email,
				username: user.username,
				image: user.image,
				bio: user.bio,
				token: tokens.accessToken,
			},
			refreshToken: tokens.refreshToken,
		};
	}
}
