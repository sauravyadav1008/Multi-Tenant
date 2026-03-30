export const tenantMiddleware = (req, res, next) => {
  const tenantId = req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ message: "Tenant not found" });
  }

  req.tenantId = tenantId;
  next();
};