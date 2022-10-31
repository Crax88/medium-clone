import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { User } from '../users/user.entity';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { TYPES } from '../types';

@injectable()
export class ProfilesRepository implements ProfilesRepositoryInterface {
	private repository: Repository<User>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(User);
	}

	async getProfile(username: string): Promise<User | null> {
		const profile = await this.repository.findOne({
			where: { username },
			relations: ['followers'],
		});

		return profile;
	}

	async saveProfile(profile: User): Promise<User> {
		const updatedProfile = await this.repository.save(profile);
		return updatedProfile;
	}
}
