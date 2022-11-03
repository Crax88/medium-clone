import { UserDto } from './user.dto';

export type UserUpdateDto = Partial<
	Pick<UserDto, 'username' | 'bio' | 'image' | 'email' | 'password'>
>;
