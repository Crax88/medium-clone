import { User } from '../user.entity';

export interface AuthResponse {
	user: Pick<User, 'email' | 'bio' | 'image' | 'username'> & {
		token: string;
	};
	refreshToken: string;
}
