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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const validation_middleware_1 = require("../common/validation.middleware");
const auth_guard_1 = require("../shared/services/auth.guard");
const types_1 = require("../types");
const userLogin_dto_1 = require("./types/userLogin.dto");
const userRegister_dto_1 = require("./types/userRegister.dto");
let UsersController = class UsersController extends base_controller_1.BaseController {
    constructor(loggerService, usersService) {
        super(loggerService);
        this.usersService = usersService;
        this.bindRoutes([
            {
                path: '/users',
                method: 'post',
                handler: this.register,
                middlewares: [new validation_middleware_1.ValidationMiddleware(userRegister_dto_1.UserRegisterRequestDto)],
            },
            {
                path: '/users/login',
                method: 'post',
                handler: this.login,
                middlewares: [new validation_middleware_1.ValidationMiddleware(userLogin_dto_1.UserLoginRequestDto)],
            },
            {
                path: '/users/refresh',
                method: 'get',
                handler: this.refresh,
            },
            {
                path: '/users/logout',
                method: 'delete',
                handler: this.logout,
            },
            {
                path: '/user',
                method: 'get',
                handler: this.authenticate,
            },
            {
                path: '/user',
                method: 'put',
                handler: this.update,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
        ]);
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, refreshToken } = yield this.usersService.register(req.body);
                res.cookie('rf', refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                this.ok(res, { user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, refreshToken } = yield this.usersService.login(req.body);
                res.cookie('rf', refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                this.ok(res, { user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rf } = req.cookies;
                yield this.usersService.logout(rf);
                res.clearCookie('rf');
                this.ok(res, {});
            }
            catch (error) {
                next(error);
            }
        });
    }
    refresh(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rf } = req.cookies;
                const { user, refreshToken } = yield this.usersService.refresh(rf);
                res.cookie('rf', refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                this.ok(res, { user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.usersService.authenticate(req.userId);
                this.ok(res, { user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield this.usersService.update(req.userId, req.body);
                this.ok(res, { user });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UsersService)),
    __metadata("design:paramtypes", [Object, Object])
], UsersController);
exports.UsersController = UsersController;
