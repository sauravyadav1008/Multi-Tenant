import dotenv from "dotenv";

dotenv.config();

const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

required.forEach((key) => {
	if (!process.env[key]) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
});

const env = {
	NODE_ENV: process.env.NODE_ENV || "development",
	PORT: Number(process.env.PORT || 5000),
	DATABASE_URL: process.env.DATABASE_URL,
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
	REFRESH_TOKEN_TTL_DAYS: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 14),
	CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
	COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
	COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE || "lax",
};

export default env;
