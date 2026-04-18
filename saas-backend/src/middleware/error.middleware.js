import logger from "../utils/logger.js";
import env from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
