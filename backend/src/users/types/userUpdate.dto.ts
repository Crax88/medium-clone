import { UserDto } from './user.dto';

export type UserUpdateDto = {
	user: Partial<Pick<UserDto, 'username' | 'bio' | 'image' | 'email' | 'password'>>;
};
