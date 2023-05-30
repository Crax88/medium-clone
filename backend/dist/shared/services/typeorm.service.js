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
exports.TypeormService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const types_1 = require("../../types");
let TypeormService = class TypeormService {
    constructor(loggerService, configService) {
        this.loggerService = loggerService;
        this.configService = configService;
        this.client = new typeorm_1.DataSource({
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: Number(this.configService.get('DB_PORT')),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            entities: this.configService.get('NODE_ENV') === 'production'
                ? ['dist/**/*.entity.js']
                : ['src/**/*.entity.{ts,js}'],
            migrations: this.configService.get('NODE_ENV') === 'production'
                ? ['dist/migrations/*.js']
                : ['src/migratons/*.{ts,js}'],
            migrationsRun: true,
            synchronize: this.configService.get('NODE_ENV') === 'production' ? false : true,
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.initialize();
                this.loggerService.info('[TypeormService] Succesfully connect to database');
            }
            catch (error) {
                error instanceof Error &&
                    this.loggerService.error(`[TypeormService] Error while connecting to database: ${error.message}`, error);
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.destroy();
                this.loggerService.info('[TypeormService] Succesfully disconnect from database');
            }
            catch (error) {
                error instanceof Error &&
                    this.loggerService.error(`[TypeormService] Error while disconnecting from database: ${error.message}`, error);
            }
        });
    }
    getRepository(entity) {
        return this.client.getRepository(entity);
    }
};
TypeormService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __metadata("design:paramtypes", [Object, Object])
], TypeormService);
exports.TypeormService = TypeormService;
