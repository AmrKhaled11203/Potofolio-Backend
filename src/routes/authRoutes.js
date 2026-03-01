import express from "express";
import { login, register } from "../controllers/authController.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.post("/auth/login", login);

router.post("/auth/register", protect, register);

export default router;
