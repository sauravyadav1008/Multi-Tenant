import express from "express";
import {
	login,
	logout,
	logoutAll,
	me,
	refresh,
	register,
} from "./auth.controller.js";
import {
	loginSchema,
	registerSchema,
	validateBody,
} from "./auth.validation.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", authMiddleware, logoutAll);
router.get("/me", authMiddleware, me);

export default router;