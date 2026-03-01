import express from "express";
import { login, register } from "../controllers/authController.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", protect, register);

export default router;
