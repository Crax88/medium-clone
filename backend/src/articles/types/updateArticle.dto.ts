import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateArticleDto {
	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	@IsOptional()
	title?: string;

	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	@IsOptional()
	description?: string;

	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	@IsOptional()
	body?: string;
}

export class UpdateArticleRequestDto {
	@ValidateNested()
	@Type(() => UpdateArticleDto)
	article: UpdateArticleDto;
}
