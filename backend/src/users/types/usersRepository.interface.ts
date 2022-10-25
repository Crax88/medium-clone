import { User } from '../user.entity';
import { UserRegisterDto } from './userRegister.dto';
import { UserUpdateDto } from './userUpdate.dto';

export interface UsersRepositoryInterface {
	createUser: (dto: UserRegisterDto) => Promise<User>;
	findUser: (query: { id?: number; username?: string; email?: string }) => Promise<User | null>;
	updateUser: (id: number, dto: UserUpdateDto) => Promise<User | null>;
}
