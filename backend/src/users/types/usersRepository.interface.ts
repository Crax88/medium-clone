import { User } from '../user.entity';
import { UserRegisterDto } from './userRegister.dto';

export interface UsersRepositoryInterface {
	createUser: (dto: UserRegisterDto) => Promise<User>;
	updateUser: (dto: User) => Promise<User | null>;
	findUser: (query: { id?: number; username?: string; email?: string }) => Promise<User | null>;
}
