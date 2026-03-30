import prisma from "../../config/db.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";

export const registerUser = async ({ email, password, companyName }) => {
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