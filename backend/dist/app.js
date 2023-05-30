"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("reflect-metadata");
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const inversify_1 = require("inversify");
const auth_middleware_1 = require("./shared/services/auth.middleware");
const typeorm_service_1 = require("./shared/services/typeorm.service");
const types_1 = require("./types");
let App = class App {
    constructor(loggerService, configService, exceptionFilter, databaseService, usersController, articlesController, tokensService, tagsController, profilesController, commentsController) {
        this.loggerService = loggerService;
        this.configService = configService;
        this.exceptionFilter = exceptionFilter;
        this.databaseService = databaseService;
        this.usersController = usersController;
        this.articlesController = articlesController;
        this.tokensService = tokensService;
        this.tagsController = tagsController;
        this.profilesController = profilesController;
        this.commentsController = commentsController;
        this.port = Number(this.configService.get('PORT'));
        this.app = (0, express_1.default)();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useMiddlewares();
            this.useRoutes();
            this.useExceptionFilters();
            yield this.databaseService.connect();
            this.server = this.app.listen(this.port, () => {
                this.loggerService.info(`[App] Server started on port ${this.port}`);
            });
            process.on('uncaughtException', (err) => {
                this.loggerService.error(`[App] Uncaught exception ${err.message}`, err);
            });
        });
    }
    close() {
        this.server.close();
    }
    useMiddlewares() {
        this.app.use((0, body_parser_1.json)());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
        }));
        const authMiddleware = new auth_middleware_1.AuthMiddleware(this.tokensService);
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }
    useRoutes() {
        this.app.use('/api', this.usersController.router);
        this.app.use('/api', this.articlesController.router);
        this.app.use('/api', this.tagsController.router);
        this.app.use('/api', this.tagsController.router);
        this.app.use('/api', this.profilesController.router);
        this.app.use('/api', this.commentsController.router);
    }
    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ExceptionFilter)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.DatabaseService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.UsersController)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.ArticlesController)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.TokenService)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.TagsController)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.ProfilesController)),
    __param(9, (0, inversify_1.inject)(types_1.TYPES.CommentsController)),
    __metadata("design:paramtypes", [Object, Object, Object, typeorm_service_1.TypeormService, Object, Object, Object, Object, Object, Object])
], App);
exports.App = App;
