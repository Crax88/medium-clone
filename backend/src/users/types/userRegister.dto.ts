import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'invalid format' })
	@IsNotEmpty({ message: 'is required' })
	email: string;

	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*]).{8,64}$/gm, {
		message: 'at least 8 characters long with 1 special character and capital character',
	})
	@IsNotEmpty({ message: 'is required' })
	password: string;

	@MinLength(3, { message: 'at least 3 characters' })
	@IsNotEmpty({ message: 'is required' })
	username: string;
}
