import { AppConfigKey } from './appConfig.interface';

export interface ConfigInterface {
	get: (key: AppConfigKey) => string;
}
