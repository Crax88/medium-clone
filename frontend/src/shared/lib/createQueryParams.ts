export const createQueryParams = (params: Record<string, unknown>): string => {
	let queryParams = '';

	for (const param in params) {
		if (params[param]) {
			queryParams += queryParams.length
				? `&${param}=${params[param]}`
				: `?${param}=${params[param]}`;
		}
	}

	return queryParams;
};
