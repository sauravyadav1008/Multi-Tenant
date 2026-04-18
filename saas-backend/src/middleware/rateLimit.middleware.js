import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";
import logger from "../utils/logger.js";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

export default apiLimiter;
