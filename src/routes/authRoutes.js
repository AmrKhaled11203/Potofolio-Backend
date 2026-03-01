import express from "express";
import { login, register } from "../controllers/authController.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register); // Temporarily unprotected to allow creating the first admin

export default router;
