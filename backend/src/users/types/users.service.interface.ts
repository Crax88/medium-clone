import { AuthResponse } from './authResponse.interface';
import { UserResponseDto } from './user.dto';
import { UserLoginDto } from './userLogin.dto';
import { UserRegisterDto } from './userRegister.dto';
import { UserUpdateDto } from './userUpdate.dto';

export interface UsersServiceInterface {
	register: (dto: UserRegisterDto) => Promise<UserResponseDto>;
	login: (dto: UserLoginDto) => Promise<UserResponseDto>;
	logout: (toke: string) => Promise<void>;
	refresh: (token: string) => Promise<UserResponseDto>;
	authenticate: (currentUserId: number) => Promise<UserResponseDto>;
	update: (currentUserId: number, dto: UserUpdateDto) => Promise<UserResponseDto>;
}
