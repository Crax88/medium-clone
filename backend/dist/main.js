"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = void 0;
const inversify_1 = require("inversify");
const articles_module_1 = require("./articles/articles.module");
const comments_module_1 = require("./comments/comments.module");
const exception_filter_1 = require("./errors/exception.filter");
const profiles_module_1 = require("./profiles/profiles.module");
const shared_module_1 = require("./shared/shared.module");
const tags_module_1 = require("./tags/tags.module");
const tokens_module_1 = require("./tokens/tokens.module");
const users_module_1 = require("./users/users.module");
const app_1 = require("./app");
const types_1 = require("./types");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const appContainer = new inversify_1.Container();
        appContainer.bind(types_1.TYPES.Application).to(app_1.App).inSingletonScope();
        appContainer
            .bind(types_1.TYPES.ExceptionFilter)
            .to(exception_filter_1.ExceptionFilter)
            .inSingletonScope();
        appContainer.load(users_module_1.UsersModule, tokens_module_1.TokensModule, shared_module_1.SharedModule, articles_module_1.ArticlesModule, tags_module_1.TagsModule, profiles_module_1.ProfilesModule, comments_module_1.CommetnsModule);
        const app = appContainer.get(types_1.TYPES.Application);
        yield app.init();
        return { app, appContainer };
    });
}
exports.boot = bootstrap();
