import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateArticleDto {
	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	title: string;

	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	description: string;

	@IsNotEmpty({ message: 'required' })
	@Transform(({ value }: TransformFnParams) => value.trim())
	@IsString()
	body: string;

	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tagList?: string[];
}

export class CreateArticleRequestDto {
	@ValidateNested()
	@Type(() => CreateArticleDto)
	@IsNotEmpty()
	article: CreateArticleDto;
}
