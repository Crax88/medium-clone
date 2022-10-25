import { AuthResponse } from './authResponse.interface';
import { UserLoginDto } from './userLogin.dto';
import { UserRegisterDto } from './userRegister.dto';
import { UserUpdateDto } from './userUpdate.dto';

export interface UsersServiceInterface {
	register: (dto: UserRegisterDto) => Promise<AuthResponse>;
	login: (dto: UserLoginDto) => Promise<AuthResponse>;
	logout: (toke: string) => Promise<void>;
	refresh: (token: string) => Promise<AuthResponse>;
	authenticate: (id: number) => Promise<AuthResponse>;
	update: (id: number, dto: UserUpdateDto) => Promise<AuthResponse>;
}
