import { UserDto } from './user.dto';
import { UserRegisterDto } from './userRegister.dto';
import { UserUpdateDto } from './userUpdate.dto';

export interface UsersRepositoryInterface {
	findUser: (query: { email?: string; username?: string; id?: number }) => Promise<UserDto | null>;
	createUser: (dto: UserRegisterDto) => Promise<void>;
	updateUser: (userId: number, dto: UserUpdateDto['user']) => Promise<void>;
}
