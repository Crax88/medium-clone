import { isFetchBaseQueryError } from './isFetchBaseQueryError';

type ValidationError = {
	data: {
		errors: {
			[key: string]: string[];
		};
	};
};

export function isValidationError(error: unknown): error is ValidationError {
	if (!isFetchBaseQueryError(error)) {
		return false;
	}

	return (
		error.status !== 200 &&
		typeof error.data === 'object' &&
		error.data !== null &&
		'errors' in error.data
	);
}
