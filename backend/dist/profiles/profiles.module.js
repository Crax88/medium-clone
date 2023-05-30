"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const profiles_controller_1 = require("./profiles.controller");
const profiles_respository_1 = require("./profiles.respository");
const profiles_service_1 = require("./profiles.service");
exports.ProfilesModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ProfilesController)
        .to(profiles_controller_1.ProfilesController)
        .inSingletonScope();
    bind(types_1.TYPES.ProfilesService).to(profiles_service_1.ProfilesService).inSingletonScope();
    bind(types_1.TYPES.ProfilesRepository)
        .to(profiles_respository_1.ProfilesRepository)
        .inSingletonScope();
});
