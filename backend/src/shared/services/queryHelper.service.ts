import { injectable } from 'inversify';

import { QueryHelperInterface } from '../types/queryHelper.interface';

@injectable()
export class QueryHelperService implements QueryHelperInterface {
	parameterOrNull(columnName: string, paramName: string, operator = '='): string {
		return `(${columnName} ${operator} :${paramName} OR COALESCE(:${paramName}, NULL) IS NULL)`;
	}

	valueOrNull(value: unknown, type: 'string' | 'number'): number | string | null {
		if (type === 'string' && typeof value === 'string') {
			return value.toString() ?? null;
		}
		if (type === 'number' && typeof value !== 'object') {
			return value === undefined || value === null ? null : +value;
		}
		return null;
	}
}
