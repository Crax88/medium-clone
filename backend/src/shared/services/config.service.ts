import { inject, injectable } from 'inversify';

import { AppConfigInterface, AppConfigKey } from '../../common/types/appConfig.interface';
import { ConfigInterface } from '../../common/types/config.interface';
import { LoggerInterface } from '../../common/types/logger.interface';
import { TYPES } from '../../types';

type a = keyof AppConfigInterface;

@injectable()
export class ConfigService implements ConfigInterface {
	private config: AppConfigInterface = {
		PORT: '',
		NODE_ENV: '',
		DB_NAME: '',
		DB_USER: '',
		DB_PORT: '',
		DB_PASSWORD: '',
		DB_HOST: '',
		ACCESS_TOKEN_SECRET: '',
		ACCESS_TOKEN_EXPIRES: '',
		REFRESH_TOKEN_SECRET: '',
		REFRESH_TOKEN_EXPIRES: '',
		SALT: '',
		ALLOWED_ORIGINS: '',
	};

	constructor(@inject(TYPES.LoggerService) private loggerService: LoggerInterface) {
		try {
			for (const param in this.config) {
				const envParam = process.env[param];
				if (!envParam) {
					throw new Error(`Parametr ${param} is not defined in the env`);
				}
				this.config[param as keyof AppConfigInterface] = envParam;
			}
			this.loggerService.info(`[ConfigService] Successfully load env configuration`);
		} catch (error) {
			error instanceof Error && this.loggerService.error(`[ConfigService] ${error.message}`, error);
		}
	}

	get(key: AppConfigKey): string {
		return this.config[key];
	}
}
