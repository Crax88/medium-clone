export interface AppConfigInterface {
	PORT: string;
	NODE_ENV: string;
	DB_HOST: string;
	DB_PORT: string;
	DB_NAME: string;
	DB_USER: string;
	DB_PASSWORD: string;
}

export type AppConfigKey = keyof AppConfigInterface;
