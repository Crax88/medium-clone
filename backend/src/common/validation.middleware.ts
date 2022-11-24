import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './types/middleware.interface';
import { ValidationErrorsInterface } from './types/validationErrors.interface';

export class ValidationMiddleware implements MiddlewareInterface {
	constructor(private classToValidate: ClassConstructor<object>) {}

	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instance = plainToClass(this.classToValidate, body);

		const errors = await validate(instance);

		if (errors.length > 0) {
			res.status(422).json({ errors: this.transformErrors(errors) });
		} else {
			next();
		}
	}

	private transformErrors(errors: ValidationError[]): ValidationErrorsInterface {
		return errors.reduce<ValidationErrorsInterface>((acc, cur) => {
			if (cur.children && cur.children.length) {
				cur.children.forEach((nested: ValidationError) => {
					acc[nested.property] = [];
					for (const key in nested?.constraints) {
						acc[nested.property].push(nested.constraints[key]);
					}
				});
			} else {
				acc[cur.property] = [];
				for (const key in cur?.constraints) {
					acc[cur.property].push(cur.constraints[key]);
				}
			}

			return acc;
		}, {});
	}
}
