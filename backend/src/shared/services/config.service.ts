import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/types/config.interface';
import { LoggerInterface } from '../../common/types/logger.interface';
import { AppConfigInterface } from '../../common/types/appConfig.interface';
import { TYPES } from '../../types';

@injectable()
export class ConfigService implements ConfigInterface {
	private config: AppConfigInterface = {
		PORT: '',
	};

	constructor(@inject(TYPES.LoggerService) private loggerService: LoggerInterface) {
		try {
			for (const param in this.config) {
				const envParam = process.env[param];
				if (!envParam) {
					throw new Error(`Parametr ${param} is not defined in the env`);
				}
				this.config[param] = envParam;
			}
			this.loggerService.info(`[ConfigService] Successfully load env configuration`);
		} catch (error) {
			error instanceof Error && this.loggerService.error(`[ConfigService] ${error.message}`, error);
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
