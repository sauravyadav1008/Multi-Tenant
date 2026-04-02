import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded; // contains userId, tenantId, role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};