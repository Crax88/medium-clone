import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { TYPES } from '../types';
import { UserRegisterDto } from './types/userRegister.dto';
import { UsersRepositoryInterface } from './types/usersRepository.interface';
import { UserUpdateDto } from './types/userUpdate.dto';
import { User } from './user.entity';

@injectable()
export class UsersRepository implements UsersRepositoryInterface {
	private repository: Repository<User>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(User);
	}

	async createUser(dto: UserRegisterDto): Promise<User> {
		const newUser = this.repository.create(dto);
		await this.repository.save(newUser);
		return newUser;
	}

	async findUser(query: {
		id?: number | undefined;
		username?: string | undefined;
		email?: string | undefined;
	}): Promise<User | null> {
		const user = await this.repository.findOne({
			where: [{ id: query.id }, { email: query.email }, { username: query.username }],
		});
		return user;
	}

	async updateUser(id: number, dto: UserUpdateDto): Promise<User | null> {
		const updatedUser = await this.repository.update({ id }, dto);
		if (!updatedUser || updatedUser.affected === 0) {
			return null;
		} else {
			return this.findUser({ id });
		}
	}
}
