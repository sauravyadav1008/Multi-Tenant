import logger from "../utils/logger.js";

/**
 * Middleware to enforce tenant isolation.
 * Ensures that the tenantId is extracted from the authenticated user and attached to the request.
 */
export const tenantMiddleware = (req, res, next) => {
  if (!req.user || !req.user.tenantId) {
    logger.warn(`Tenant isolation breach attempt or missing context: ${req.method} ${req.originalUrl}`);
    return res.status(403).json({ 
      status: "error",
      message: "Access Denied: Tenant context missing" 
    });
  }

  const tenantId = req.user.tenantId;

  // Attach tenantId to req for use in controllers/services
  req.tenantId = tenantId;

  logger.debug(`Tenant context set for: ${tenantId}`);
  next();
};
