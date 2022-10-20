import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { DataSource, ObjectLiteral, ObjectType, Repository } from 'typeorm';
import { DatabaseInterface } from '../../common/types/database.interface';
import { LoggerInterface } from '../../common/types/logger.interface';
import { ConfigInterface } from '../../common/types/config.interface';
import { TYPES } from '../../types';

@injectable()
export class TypeormService implements DatabaseInterface {
	client: DataSource;

	constructor(
		@inject(TYPES.LoggerService) private loggerService: LoggerInterface,
		@inject(TYPES.ConfigService) private configService: ConfigInterface,
	) {
		this.client = new DataSource({
			type: 'postgres',
			host: this.configService.get('DB_HOST'),
			port: Number(this.configService.get('DB_PORT')),
			username: this.configService.get('DB_USER'),
			password: this.configService.get('DB_PASSWORD'),
			database: this.configService.get('DB_NAME'),
			entities:
				this.configService.get('NODE_ENV') === 'production'
					? ['dist/**/*.entity.js']
					: ['src/**/*.entity.{ts,js}'],
			migrations:
				this.configService.get('NODE_ENV') === 'production'
					? ['dist/migrations/*.js']
					: ['src/migratons/*.{ts,js}'],
			migrationsRun: true,
			synchronize: this.configService.get('NODE_ENV') === 'production' ? false : true,
		});
	}

	async connect(): Promise<void> {
		try {
			await this.client.initialize();
			this.loggerService.info('[TypeormService] Succesfully connect to database');
		} catch (error) {
			error instanceof Error &&
				this.loggerService.error(
					`[TypeormService] Error while connecting to database: ${error.message}`,
					error,
				);
		}
	}

	async disconnect(): Promise<void> {
		try {
			await this.client.destroy();
			this.loggerService.info('[TypeormService] Succesfully disconnect from database');
		} catch (error) {
			error instanceof Error &&
				this.loggerService.error(
					`[TypeormService] Error while disconnecting from database: ${error.message}`,
					error,
				);
		}
	}

	getRepository<T extends ObjectLiteral>(entity: ObjectType<T>): Repository<T> {
		return this.client.getRepository<T>(entity);
	}
}
