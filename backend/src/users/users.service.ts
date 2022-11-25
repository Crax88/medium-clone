import { inject, injectable } from 'inversify';
import { hash, genSalt, compare } from 'bcryptjs';
import { HttpError } from '../errors/httpError';
import { ConfigInterface } from '../common/types/config.interface';
import { TokensServiceInterface } from '../tokens/types/tokens.service.interface';
import { UsersServiceInterface } from './types/users.service.interface';
import { UsersRepositoryInterface } from './types/users.repository.interface';
import { UserLoginRequestDto } from './types/userLogin.dto';
import { UserRegisterRequestDto } from './types/userRegister.dto';
import { UserUpdateDto } from './types/userUpdate.dto';
import { UserDto, UserResponseDto } from './types/user.dto';
import { TYPES } from '../types';
import { ValidationError } from '../errors/validationError';

@injectable()
export class UsersService implements UsersServiceInterface {
	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigInterface,
		@inject(TYPES.TokenService) private tokensService: TokensServiceInterface,
		@inject(TYPES.UsersRepository) private usersRepository: UsersRepositoryInterface,
	) {}

	async register({ user: dto }: UserRegisterRequestDto): Promise<UserResponseDto> {
		let candidate = await this.usersRepository.findUser({
			email: dto.email,
		});
		if (candidate) {
			throw new ValidationError({ email: ['already exists'] });
		}
		candidate = await this.usersRepository.findUser({
			username: dto.username,
		});
		if (candidate) {
			throw new ValidationError({ username: ['already exists'] });
		}
		const salt = await genSalt(Number(this.configService.get('SALT')));
		const hashedPasword = await hash(dto.password, salt);
		dto.password = hashedPasword;
		await this.usersRepository.createUser(dto);
		const user = await this.usersRepository.findUser({ username: dto.username });
		if (!user) {
			throw new HttpError(500, 'Error receiving user info');
		}
		const tokens = this.tokensService.generateTokens({ userId: user.id });
		await this.tokensService.saveToken(user.id, tokens.refreshToken);
		return this.buildAuthResponse(user, tokens);
	}

	async login({ user: dto }: UserLoginRequestDto): Promise<UserResponseDto> {
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

	async refresh(token: string): Promise<UserResponseDto> {
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

	async authenticate(id: number): Promise<UserResponseDto> {
		if (!id) {
			throw new HttpError(401, 'unauthorized');
		}
		const user = await this.usersRepository.findUser({ id });
		if (!user) {
			throw new HttpError(401, 'unauthorized');
		}
		const tokens = this.tokensService.generateTokens({ userId: user.id });
		return this.buildAuthResponse(user, tokens);
	}

	async logout(token: string): Promise<void> {
		await this.tokensService.removeToken(token);
	}

	async update(currentUserId: number, { user: dto }: UserUpdateDto): Promise<UserResponseDto> {
		const savedUser = await this.usersRepository.findUser({ id: currentUserId });
		if (!savedUser) {
			throw new HttpError(404, 'user not found');
		}

		if (dto.username) {
			const existedUsername = await this.usersRepository.findUser({ username: dto.username });
			if (existedUsername && existedUsername.id !== currentUserId) {
				throw new ValidationError({ username: ['username already taken'] });
			}
		}

		if (dto.email) {
			const existedEmail = await this.usersRepository.findUser({ email: dto.email });
			if (existedEmail && existedEmail.id !== currentUserId) {
				throw new ValidationError({ email: ['email already taken'] });
			}
		}

		const toUpdateFields: UserUpdateDto['user'] = {};

		for (const key in dto) {
			if (
				dto[key as keyof UserUpdateDto['user']] !== undefined &&
				dto[key as keyof UserUpdateDto['user']] !== null &&
				dto[key as keyof UserUpdateDto['user']] !== ''
			) {
				toUpdateFields[key as keyof UserUpdateDto['user']] = dto[
					key as keyof UserUpdateDto['user']
				] as string;
			}
		}
		if (toUpdateFields.password) {
			const salt = await genSalt(Number(this.configService.get('SALT')));
			const hashedPasword = await hash(toUpdateFields.password, salt);
			toUpdateFields.password = hashedPasword;
		}
		await this.usersRepository.updateUser(currentUserId, toUpdateFields);
		const tokens = this.tokensService.generateTokens({ userId: currentUserId });
		return this.buildAuthResponse({ ...savedUser, ...toUpdateFields }, tokens);
	}

	private buildAuthResponse(
		user: UserDto,
		tokens: { refreshToken: string; accessToken: string },
	): UserResponseDto {
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
