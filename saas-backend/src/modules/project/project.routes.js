import express from "express";
import {
  createProject,
  getProjects,
} from "./project.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// Only ADMIN & MANAGER can create project
router.post(
  "/",
  authMiddleware,
  tenantMiddleware,
  authorizeRoles("ADMIN", "MANAGER"),
  createProject
);

// All roles can view
router.get(
  "/",
  authMiddleware,
  tenantMiddleware,
  authorizeRoles("ADMIN", "MANAGER", "USER"),
  getProjects
);

export default router;