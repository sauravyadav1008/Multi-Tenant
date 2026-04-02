import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL }
  );
};

export const generateRefreshToken = ({
  userId,
  tenantId,
  role,
  sessionId,
}) => {
  return jwt.sign(
    {
      userId,
      tenantId,
      role,
      sid: sessionId,
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};