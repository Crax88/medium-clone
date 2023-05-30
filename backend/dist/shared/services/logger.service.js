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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const inversify_1 = require("inversify");
const winston_1 = __importDefault(require("winston"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'white',
};
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true, colors }), winston_1.default.format.printf((info) => {
    return `${info.timestamp} ${info.level} ${info.message}`;
}));
const errorFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true, colors }), winston_1.default.format.printf((info) => {
    return `${info.timestamp} ${info.level} ${info.message}`;
}), winston_1.default.format.json());
const transports = [
    new winston_1.default.transports.Console({ format: consoleFormat }),
    new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: errorFormat,
    }),
];
const configOptions = {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
    levels: levels,
    transports,
};
let LoggerService = class LoggerService {
    constructor() {
        this.logger = winston_1.default.createLogger(configOptions);
    }
    stringifyArgs(...args) {
        return args
            .map((arg) => {
            if (typeof arg === 'number' || typeof arg === 'string') {
                return arg;
            }
            if (arg instanceof Error) {
                return JSON.stringify(arg, Object.getOwnPropertyNames(arg));
            }
            return JSON.stringify(arg);
        })
            .join(' ');
    }
    info(...args) {
        this.logger.info(this.stringifyArgs(...args));
    }
    warn(...args) {
        this.logger.warn(this.stringifyArgs(...args));
    }
    error(...args) {
        this.logger.error(this.stringifyArgs(...args));
    }
    http(...args) {
        this.logger.http(this.stringifyArgs(...args));
    }
    debug(...args) {
        this.logger.debug(this.stringifyArgs(...args));
    }
};
LoggerService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
exports.LoggerService = LoggerService;
