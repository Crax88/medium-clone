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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types");
let ConfigService = class ConfigService {
    constructor(loggerService) {
        this.loggerService = loggerService;
        this.config = {
            PORT: '',
            NODE_ENV: '',
            DB_NAME: '',
            DB_USER: '',
            DB_PORT: '',
            DB_PASSWORD: '',
            DB_HOST: '',
            ACCESS_TOKEN_SECRET: '',
            ACCESS_TOKEN_EXPIRES: '',
            REFRESH_TOKEN_SECRET: '',
            REFRESH_TOKEN_EXPIRES: '',
            SALT: '',
        };
        try {
            for (const param in this.config) {
                const envParam = process.env[param];
                if (!envParam) {
                    throw new Error(`Parametr ${param} is not defined in the env`);
                }
                this.config[param] = envParam;
            }
            this.loggerService.info(`[ConfigService] Successfully load env configuration`);
        }
        catch (error) {
            error instanceof Error && this.loggerService.error(`[ConfigService] ${error.message}`, error);
        }
    }
    get(key) {
        return this.config[key];
    }
};
ConfigService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __metadata("design:paramtypes", [Object])
], ConfigService);
exports.ConfigService = ConfigService;
