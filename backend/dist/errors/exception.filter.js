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
exports.ExceptionFilter = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const httpError_1 = require("./httpError");
const validationError_1 = require("./validationError");
let ExceptionFilter = class ExceptionFilter {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    catch(err, req, res, next) {
        if (err instanceof validationError_1.ValidationError) {
            this.loggerService.warn(`[${err.context}] Error: ${err.statusCode} ${err.message}`);
            res.status(err.statusCode).send({ errors: err.errors });
        }
        else if (err instanceof httpError_1.HttpError) {
            this.loggerService.warn(`[${err.context}] Error: ${err.statusCode} ${err.message}`);
            res.status(err.statusCode).send({ errors: { error: [err.message] } });
        }
        else {
            this.loggerService.error(`[Error] ${err.message}`, err);
            res.status(500).send({ errors: { error: ['Internal server error'] } });
        }
    }
};
ExceptionFilter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.LoggerService)),
    __metadata("design:paramtypes", [Object])
], ExceptionFilter);
exports.ExceptionFilter = ExceptionFilter;
