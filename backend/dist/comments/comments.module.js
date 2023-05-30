"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommetnsModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const comments_controller_1 = require("./comments.controller");
const comments_respository_1 = require("./comments.respository");
const comments_service_1 = require("./comments.service");
exports.CommetnsModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.CommentsController)
        .to(comments_controller_1.CommentsController)
        .inSingletonScope();
    bind(types_1.TYPES.CommentsService).to(comments_service_1.CommentsService).inSingletonScope();
    bind(types_1.TYPES.CommentsRepository)
        .to(comments_respository_1.CommentsRepository)
        .inSingletonScope();
});
