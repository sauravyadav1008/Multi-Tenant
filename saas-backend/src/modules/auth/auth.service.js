import prisma from "../../config/db.js";
import crypto from "crypto";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import env from "../../config/env.js";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const getRefreshExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
};

const createSessionTokens = async (user, meta) => {
  const sessionId = crypto.randomUUID();
  const refreshToken = generateRefreshToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
    sessionId,
  });

  await prisma.refreshSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt: getRefreshExpiry(),
    },
  });

  return {
    accessToken: generateAccessToken(user),
    refreshToken,
  };
};

const validateSession = (session, decoded) => {
  if (!session) {
    throw new Error("Session not found");
  }

  if (session.revokedAt) {
    throw new Error("Session revoked");
  }

  if (session.expiresAt < new Date()) {
    throw new Error("Session expired");
  }

  if (session.userId !== decoded.userId) {
    throw new Error("Session mismatch");
  }
};

export const registerUser = async ({ email, password, companyName }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Hash password
  const hashed = await hashPassword(password);

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: companyName,
    },
  });

  // Create admin user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: "ADMIN",
      tenantId: tenant.id,
    },
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};

export const createAuthSession = async (user, meta) => {
  return createSessionTokens(user, meta);
};

export const rotateRefreshSession = async (refreshToken, meta) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  const currentSession = await prisma.refreshSession.findUnique({
    where: { id: decoded.sid },
    include: { user: true },
  });

  validateSession(currentSession, decoded);

  const incomingHash = hashToken(refreshToken);
  const storedHash = currentSession.tokenHash;

  if (incomingHash !== storedHash) {
    await prisma.refreshSession.updateMany({
      where: {
        userId: decoded.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    throw new Error("Refresh token reuse detected");
  }

  const nextSessionId = crypto.randomUUID();
  const nextRefreshToken = generateRefreshToken({
    userId: currentSession.user.id,
    tenantId: currentSession.user.tenantId,
    role: currentSession.user.role,
    sessionId: nextSessionId,
  });

  await prisma.$transaction([
    prisma.refreshSession.update({
      where: { id: currentSession.id },
      data: {
        revokedAt: new Date(),
        replacedBySessionId: nextSessionId,
      },
    }),
    prisma.refreshSession.create({
      data: {
        id: nextSessionId,
        userId: currentSession.user.id,
        tokenHash: hashToken(nextRefreshToken),
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        expiresAt: getRefreshExpiry(),
      },
    }),
  ]);

  return {
    accessToken: generateAccessToken(currentSession.user),
    refreshToken: nextRefreshToken,
    user: currentSession.user,
  };
};

export const revokeSessionByRefreshToken = async (refreshToken) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }

  const session = await prisma.refreshSession.findUnique({
    where: { id: decoded.sid },
  });

  if (!session || session.revokedAt) {
    return;
  }

  if (session.tokenHash !== hashToken(refreshToken)) {
    return;
  }

  await prisma.refreshSession.update({
    where: { id: session.id },
    data: {
      revokedAt: new Date(),
    },
  });
};

export const revokeAllSessionsForUser = async (userId) => {
  await prisma.refreshSession.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};