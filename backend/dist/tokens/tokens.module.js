"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const tokens_repository_1 = require("./tokens.repository");
const tokens_service_1 = require("./tokens.service");
exports.TokensModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.TokenService).to(tokens_service_1.TokensService).inSingletonScope();
    bind(types_1.TYPES.TokenRepository).to(tokens_repository_1.TokensRepository).inSingletonScope();
});
