"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormconfig = void 0;
const typeorm_1 = require("typeorm");
exports.ormconfig = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'medium-clone',
    username: 'medium',
    password: 'medium',
    entities: ['./**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
};
const PostgresDataSource = new typeorm_1.DataSource(Object.assign({}, exports.ormconfig));
PostgresDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization', err);
});
exports.default = PostgresDataSource;
