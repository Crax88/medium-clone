import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class UserLoginDto {
	@IsNotEmpty({ message: 'is required' })
	email: string;

	@IsNotEmpty({ message: 'is required' })
	password: string;
}

export class UserLoginRequestDto {
	@ValidateNested()
	@Type(() => UserLoginDto)
	@IsNotEmpty()
	user: UserLoginDto;
}
