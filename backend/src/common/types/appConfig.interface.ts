export interface AppConfigInterface {
	PORT: string;
	NODE_ENV: string;
	DB_HOST: string;
	DB_PORT: string;
	DB_NAME: string;
	DB_USER: string;
	DB_PASSWORD: string;
	ACCESS_TOKEN_SECRET: string;
	ACCESS_TOKEN_EXPIRES: string;
	REFRESH_TOKEN_SECRET: string;
	REFRESH_TOKEN_EXPIRES: string;
	SALT: string;
	ALLOWED_ORIGINS: string;
}

export type AppConfigKey = keyof AppConfigInterface;
