import { HttpError } from './httpError';

export class ValidationError extends HttpError {
	errors: Record<string, string[]>;

	constructor(errors: Record<string, string[]>, context?: string) {
		super(400, 'Validation error', context);
		this.errors = errors;
	}
}
