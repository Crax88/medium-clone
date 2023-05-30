"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const users_controller_1 = require("./users.controller");
const users_repository_1 = require("./users.repository");
const users_service_1 = require("./users.service");
exports.UsersModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.UsersController).to(users_controller_1.UsersController).inSingletonScope();
    bind(types_1.TYPES.UsersService).to(users_service_1.UsersService).inSingletonScope();
    bind(types_1.TYPES.UsersRepository).to(users_repository_1.UsersRepository).inSingletonScope();
});
