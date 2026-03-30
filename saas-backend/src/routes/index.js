import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import projectRoutes from "../modules/project/project.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);

export default router;