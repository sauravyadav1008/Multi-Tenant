import env from "../../config/env.js";
import {
  createAuthSession,
  loginUser,
  registerUser,
  revokeAllSessionsForUser,
  revokeSessionByRefreshToken,
  rotateRefreshSession,
} from "./auth.service.js";

const REFRESH_COOKIE_NAME = "rt";

const getCookieOptions = () => {
  const sameSite = env.COOKIE_SAME_SITE.toLowerCase();
  const isSecure =
    env.NODE_ENV === "production" || sameSite === "none";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    domain: env.COOKIE_DOMAIN,
    path: "/api/auth",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions());
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: undefined,
  });
};

const toSafeUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  tenantId: user.tenantId,
  createdAt: user.createdAt,
});

const getRequestMeta = (req) => ({
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"] || "unknown",
});

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    const { accessToken, refreshToken } = await createAuthSession(
      user,
      getRequestMeta(req)
    );

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      accessToken,
      user: toSafeUser(user),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    const { accessToken, refreshToken } = await createAuthSession(
      user,
      getRequestMeta(req)
    );

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: toSafeUser(user),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const session = await rotateRefreshSession(refreshToken, getRequestMeta(req));

    setRefreshCookie(res, session.refreshToken);

    return res.json({
      accessToken: session.accessToken,
      user: toSafeUser(session.user),
    });
  } catch (err) {
    clearRefreshCookie(res);
    return res.status(401).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

  if (refreshToken) {
    await revokeSessionByRefreshToken(refreshToken);
  }

  clearRefreshCookie(res);
  return res.status(204).send();
};

export const logoutAll = async (req, res) => {
  await revokeAllSessionsForUser(req.user.userId);
  clearRefreshCookie(res);
  return res.status(204).send();
};

export const me = async (req, res) => {
  return res.json({ user: req.user });
};