import { AuthResponse } from './authResponse.interface';
import { UserLoginDto } from './userLogin.dto';
import { UserRegisterDto } from './userRegister.dto';

export interface UsersServiceInterface {
	register: (dto: UserRegisterDto) => Promise<AuthResponse>;
	login: (dto: UserLoginDto) => Promise<AuthResponse>;
	logout: (toke: string) => Promise<void>;
	refresh: (token: string) => Promise<AuthResponse>;
	authenticate: (id: number) => Promise<AuthResponse>;
}
