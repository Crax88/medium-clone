import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { TypeormService } from '../shared/services/typeorm.service';
import { User } from '../users/user.entity';
import { ProfilesRepositoryInterface } from './types/profiles.repository.interface';
import { ProfileDto } from './types/profile.dto';
import { TYPES } from '../types';

@injectable()
export class ProfilesRepository implements ProfilesRepositoryInterface {
	private repository: Repository<User>;

	constructor(@inject(TYPES.DatabaseService) databaseService: TypeormService) {
		this.repository = databaseService.getRepository(User);
	}

	async getProfile(profileUsername: string, currentUserId?: number): Promise<ProfileDto | null> {
		const profile = await this.repository
			.createQueryBuilder('p')
			.select([
				'p.username',
				'p.bio',
				'p.image',
				'CASE WHEN pf.follower_id IS NOT NULL THEN true ELSE false END as following',
			])
			.leftJoin(
				'profile_followers',
				'pf',
				'pf.following_id = p.id AND pf.follower_id = :currentUserId',
				{ currentUserId },
			)
			.where('p.username = :username', { username: profileUsername })
			.getRawOne();

		return profile;
	}

	async followProfile(profileUsername: string, followerId: number): Promise<void> {
		await this.repository.query(
			'INSERT INTO profile_followers (following_id, follower_id) VALUES ((SELECT id FROM users WHERE username = $1), $2)',
			[profileUsername, followerId],
		);
	}

	async unfollowProfile(profileUsername: string, followerId: number): Promise<void> {
		await this.repository.query(
			'DELETE FROM profile_followers WHERE following_id = (SELECT id FROM users WHERE username = $1) AND follower_id = $2',
			[profileUsername, followerId],
		);
	}
}
