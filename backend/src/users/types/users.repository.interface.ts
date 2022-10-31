import { UpdateResult } from 'typeorm';
import { User } from '../user.entity';
import { UserRegisterDto } from './userRegister.dto';
import { UserUpdateDto } from './userUpdate.dto';

export interface UsersRepositoryInterface {
	findUser: (query: { email?: string; username?: string; id?: number }) => Promise<User | null>;
	createUser: (dto: UserRegisterDto) => Promise<User>;
	updateUser: (userId: number, dto: UserUpdateDto) => Promise<UpdateResult>;
}
