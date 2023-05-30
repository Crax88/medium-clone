"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const tags_controller_1 = require("./tags.controller");
const tags_repository_1 = require("./tags.repository");
const tags_service_1 = require("./tags.service");
exports.TagsModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.TagsService).to(tags_service_1.TagsService).inSingletonScope();
    bind(types_1.TYPES.TagsController).to(tags_controller_1.TagsController).inSingletonScope();
    bind(types_1.TYPES.TagsRepository).to(tags_repository_1.TagsRepository).inSingletonScope();
});
