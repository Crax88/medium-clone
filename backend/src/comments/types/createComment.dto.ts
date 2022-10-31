import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateCommentDto {
	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	body: string;
}

export class CreateCommentRequestDto {
	@ValidateNested()
	@Type(() => CreateCommentDto)
	@IsDefined({ message: 'comment should not be empty' })
	comment: CreateCommentDto;
}
