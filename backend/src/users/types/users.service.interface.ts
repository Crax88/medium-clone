import { UserResponseDto } from './user.dto';
import { UserLoginRequestDto } from './userLogin.dto';
import { UserRegisterRequestDto } from './userRegister.dto';
import { UserUpdateDto } from './userUpdate.dto';

export interface UsersServiceInterface {
	register: (dto: UserRegisterRequestDto) => Promise<UserResponseDto>;
	login: (dto: UserLoginRequestDto) => Promise<UserResponseDto>;
	logout: (toke: string) => Promise<void>;
	refresh: (token: string) => Promise<UserResponseDto>;
	authenticate: (currentUserId: number) => Promise<UserResponseDto>;
	update: (currentUserId: number, dto: UserUpdateDto) => Promise<UserResponseDto>;
}
