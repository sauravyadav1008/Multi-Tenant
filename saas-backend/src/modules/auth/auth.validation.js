import { z } from "zod";

export const registerSchema = z.object({
	email: z.string().trim().email(),
	password: z
		.string()
		.min(8)
		.max(72)
		.regex(/[A-Z]/, "Password must include at least one uppercase letter")
		.regex(/[a-z]/, "Password must include at least one lowercase letter")
		.regex(/[0-9]/, "Password must include at least one number"),
	companyName: z.string().trim().min(2).max(120),
});

export const loginSchema = z.object({
	email: z.string().trim().email(),
	password: z.string().min(8).max(72),
});

export const validateBody = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.body);

	if (!result.success) {
		const errors = result.error.issues.map((issue) => ({
			field: issue.path.join("."),
			message: issue.message,
		}));

		return res.status(400).json({
			message: "Validation failed",
			errors,
		});
	}

	req.body = result.data;
	return next();
};
