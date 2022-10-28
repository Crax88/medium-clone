import { ContainerModule, interfaces } from 'inversify';
import { TypeormService } from './services/typeorm.service';
import { ConfigInterface } from '../common/types/config.interface';
import { LoggerInterface } from '../common/types/logger.interface';
import { ConfigService } from './services/config.service';
import { LoggerService } from './services/logger.service';
import { QueryHelperService } from './services/queryHelper.service';
import { QueryHelperInterface } from './types/queryHelper.interface';
import { TYPES } from '../types';

export const SharedModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<LoggerInterface>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<ConfigInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<TypeormService>(TYPES.DatabaseService).to(TypeormService).inSingletonScope();
	bind<QueryHelperInterface>(TYPES.QueryHelper).to(QueryHelperService).inSingletonScope();
});
