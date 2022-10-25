import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
	@IsNotEmpty({ message: 'is required' })
	email: string;

	@IsNotEmpty({ message: 'is required' })
	password: string;
}
