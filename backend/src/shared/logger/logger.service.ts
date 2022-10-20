import { injectable } from 'inversify';
import winston, { Logger, LoggerOptions } from 'winston';
import { LoggerInterface } from '../../common/types/logger.interface';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'blue',
	http: 'magenta',
	debug: 'white',
};

const consoleFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.colorize({ all: true, colors }),
	winston.format.printf((info) => {
		return `${info.timestamp} ${info.level} ${info.message}`;
	}),
);

const errorFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
	winston.format.colorize({ all: true, colors }),
	winston.format.printf((info) => {
		return `${info.timestamp} ${info.level} ${info.message}`;
	}),
	winston.format.json(),
);

const transports = [
	new winston.transports.Console({ format: consoleFormat }),
	new winston.transports.File({
		filename: 'logs/error.log',
		level: 'error',
		format: errorFormat,
	}),
];

const configOptions: LoggerOptions = {
	level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
	levels: levels,
	transports,
};

@injectable()
export class LoggerService implements LoggerInterface {
	logger: Logger;

	constructor() {
		this.logger = winston.createLogger(configOptions);
	}

	private stringifyArgs(...args: unknown[]): string {
		return args
			.map((arg) => {
				if (typeof arg === 'number' || typeof arg === 'string') {
					return arg;
				}

				return JSON.stringify(arg);
			})
			.join(' ');
	}

	info(...args: unknown[]): void {
		this.logger.info(this.stringifyArgs(...args));
	}

	warn(...args: unknown[]): void {
		this.logger.warn(this.stringifyArgs(...args));
	}

	error(...args: unknown[]): void {
		this.logger.error(this.stringifyArgs(...args));
	}

	http(...args: unknown[]): void {
		this.logger.http(this.stringifyArgs(...args));
	}

	debug(...args: unknown[]): void {
		this.logger.debug(this.stringifyArgs(...args));
	}
}
