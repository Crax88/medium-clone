export interface QueryHelperInterface {
	parameterOrNull: (columnName: string, paramName: string, operator?: string) => string;

	valueOrNull(value: unknown, type: 'string' | 'number'): number | string | null;
}
