console.log("ENV.JS EXECUTING...");
import 'dotenv/config';

// Store the original NODE_ENV (from vitest) before loading .env
const originalNodeEnv = process.env.NODE_ENV;
const isVitest = process.env.VITEST;

// Restore NODE_ENV if we're in test mode
if (originalNodeEnv === "test" || isVitest) {
  process.env.NODE_ENV = "test";
}

console.log("DATABASE_URL starting with:", process.env.DATABASE_URL?.substring(0, 20));
console.log("NODE_ENV:", process.env.NODE_ENV, "VITEST:", process.env.VITEST);

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
	REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};

export default env;
