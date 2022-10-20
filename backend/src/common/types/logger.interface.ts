export interface LoggerInterface {
	logger: unknown;
	info: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	http: (...args: unknown[]) => void;
	debug: (...args: unknown[]) => void;
}
