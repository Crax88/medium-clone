import { AuthResponse } from '../../users/types/authResponse.interface';

export interface ProfileDto {
	profile: Pick<AuthResponse['user'], 'username' | 'bio' | 'image'> & { following: boolean };
}
