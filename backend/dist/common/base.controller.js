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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
require("reflect-metadata");
const express_1 = require("express");
const inversify_1 = require("inversify");
let BaseController = class BaseController {
    constructor(loggerService) {
        this.loggerService = loggerService;
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    send(res, code, data) {
        res.type('application/json');
        return res.status(code).json(data);
    }
    ok(res, data) {
        return this.send(res, 200, data);
    }
    created(res, data) {
        return this.send(res, 201, data);
    }
    bindRoutes(routes) {
        var _a;
        for (const route of routes) {
            const routePath = `${route.path}`.replace(/\/$/, '');
            this.loggerService.info(`[${route.method}] ${routePath}`);
            const middleware = (_a = route === null || route === void 0 ? void 0 : route.middlewares) === null || _a === void 0 ? void 0 : _a.map((m) => m.execute.bind(m));
            const handler = route.handler.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;
            this.router[route.method](route.path, pipeline);
        }
    }
};
BaseController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], BaseController);
exports.BaseController = BaseController;
