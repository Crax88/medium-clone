"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const config_service_1 = require("./services/config.service");
const logger_service_1 = require("./services/logger.service");
const queryHelper_service_1 = require("./services/queryHelper.service");
const typeorm_service_1 = require("./services/typeorm.service");
exports.SharedModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.LoggerService).to(logger_service_1.LoggerService).inSingletonScope();
    bind(types_1.TYPES.ConfigService).to(config_service_1.ConfigService).inSingletonScope();
    bind(types_1.TYPES.DatabaseService).to(typeorm_service_1.TypeormService).inSingletonScope();
    bind(types_1.TYPES.QueryHelper).to(queryHelper_service_1.QueryHelperService).inSingletonScope();
});
