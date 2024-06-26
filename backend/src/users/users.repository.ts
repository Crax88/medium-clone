import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';

import { TypeormService } from '../shared/services/typeorm.service';
import { TYPES } from '../types';

import { UserDto } from './types/user.dto';
import { UserRegisterDto } from './types/userRegister.dto';
import { UsersRepositoryInterface } from './types/users.repository.interface';
import { UserUpdateDto } from './types/userUpdate.dto';
import { User } from './user.entity';

@injectable()
export class UsersRepository implements UsersRepositoryInterface {
	private repository: Repository<User>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(User);
	}

	async findUser(query: {
		email?: string | undefined;
		username?: string | undefined;
	}): Promise<UserDto | null> {
		const foundUser = await this.repository.findOne({ where: query });
		return foundUser;
	}

	async createUser(dto: UserRegisterDto): Promise<void> {
		const newUser = this.repository.create(dto);
		await this.repository.save(newUser);
	}

	async updateUser(userId: number, dto: UserUpdateDto['user']): Promise<void> {
		await this.repository.update(userId, dto as User);
	}
}
