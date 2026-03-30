import { registerUser, loginUser } from "./auth.service.js";
import { generateToken } from "../../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);

    const token = generateToken(user);

    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};