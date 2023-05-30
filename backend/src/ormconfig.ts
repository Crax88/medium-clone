import { DataSource, DataSourceOptions } from 'typeorm';

export const ormconfig: DataSourceOptions = {
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

const PostgresDataSource = new DataSource({
	...ormconfig,
});

PostgresDataSource.initialize()
	.then(() => {
		console.log('Data Source has been initialized!');
	})
	.catch((err) => {
		console.error('Error during Data Source initialization', err);
	});

export default PostgresDataSource;
