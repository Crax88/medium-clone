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
exports.ProfilesController = void 0;
const inversify_1 = require("inversify");
const base_controller_1 = require("../common/base.controller");
const auth_guard_1 = require("../shared/services/auth.guard");
const types_1 = require("../types");
let ProfilesController = class ProfilesController extends base_controller_1.BaseController {
    constructor(loggerService, profilesService) {
        super(loggerService);
        this.profilesService = profilesService;
        this.bindRoutes([
            {
                path: '/profiles/:username',
                method: 'get',
                handler: this.getProfile,
            },
            {
                path: '/profiles/:username/follow',
                method: 'post',
                handler: this.followProfile,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
            {
                path: '/profiles/:username/follow',
                method: 'delete',
                handler: this.unfollowProfile,
                middlewares: [new auth_guard_1.AuthGuard()],
            },
        ]);
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profilesService.getProfile(req.params.username, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    followProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profilesService.followProfile(req.params.username, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    unfollowProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.profilesService.unfollowProfile(req.params.username, req.userId);
                this.ok(res, result);
            }
            catch (error) {
                next(error);
            }
        });
    }
};
ProfilesController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ProfilesService)),
    __metadata("design:paramtypes", [Object, Object])
], ProfilesController);
exports.ProfilesController = ProfilesController;
