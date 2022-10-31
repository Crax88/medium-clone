import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { HttpError } from '../errors/httpError';
import { TypeormService } from '../shared/services/typeorm.service';
import { TYPES } from '../types';
import { User } from '../users/user.entity';
import { ProfileDto } from './types/profile.dto';
import { ProfilesServiceInterface } from './types/profilesService.interface';

@injectable()
export class ProfilesService implements ProfilesServiceInterface {
	private usersRepository: Repository<User>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.usersRepository = databaseService.getRepository(User);
	}

	async getProfile(username: string, userId?: number): Promise<ProfileDto> {
		const profile = await this.usersRepository
			.createQueryBuilder('p')
			.select([
				'p.username',
				'p.image',
				'p.bio',
				'CASE WHEN pf.follower_id IS NOT NULL THEN true ELSE false END as following',
			])
			.leftJoin(
				'profile_followers',
				'pf',
				`pf.following_id = p.id AND (CASE WHEN ${userId ? userId : null} IS NOT NULL THEN ${
					userId ? userId : null
				} = pf.follower_id ELSE false END )`,
			)
			.where('p.username = :username', { username })
			.getRawOne();

		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}
		return { profile };
	}

	async followProfile(username: string, userId: number): Promise<ProfileDto> {
		const profile = await this.usersRepository.findOne({
			where: { username },
			relations: {
				followers: true,
			},
		});

		if (!profile) {
			throw new HttpError(404, 'profile not found');
		}
		if (profile.id === userId) {
			return this.getProfile(username, userId);
		}
		if (profile?.followers.find((user) => user.id === userId)) {
			profile.followers = profile.followers.filter((user) => user.id !== userId);
		} else {
			profile?.followers.push({ id: userId } as User);
		}
		await this.usersRepository.save(profile);
		return this.getProfile(username, userId);
	}
}
