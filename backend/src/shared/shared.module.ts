import { ContainerModule, interfaces } from 'inversify';
import { ConfigInterface } from '../common/types/config.interface';
import { LoggerInterface } from '../common/types/logger.interface';
import { TYPES } from '../types';
import { ConfigService } from './services/config.service';
import { LoggerService } from './services/logger.service';
import { TypeormService } from './services/typeorm.service';

export const SharedModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<LoggerInterface>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<ConfigInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<TypeormService>(TYPES.DatabaseService).to(TypeormService).inSingletonScope();
});
