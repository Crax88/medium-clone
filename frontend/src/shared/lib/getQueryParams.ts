export const getQueryParams = (search?: string) => {
	const params = new URLSearchParams(search || window.location.search);

	return Object.fromEntries(params.entries());
};
