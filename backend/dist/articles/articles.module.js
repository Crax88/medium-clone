"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesModule = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const articles_controller_1 = require("./articles.controller");
const articles_repository_1 = require("./articles.repository");
const articles_service_1 = require("./articles.service");
exports.ArticlesModule = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ArticlesController)
        .to(articles_controller_1.ArticlesContoller)
        .inSingletonScope();
    bind(types_1.TYPES.ArticlesService).to(articles_service_1.ArticlesService).inSingletonScope();
    bind(types_1.TYPES.ArticlesRepository)
        .to(articles_repository_1.ArticlesRepository)
        .inSingletonScope();
});
