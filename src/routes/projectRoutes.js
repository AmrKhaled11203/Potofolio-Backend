import express from "express";
import {
  createProject,
  deleteProject,
  // Add other controller functions here if you have them
} from "../controllers/ProjectController.js";

import upload from "../middleware/upload.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

// Define your routes
router.post("/", protect, upload.single("image"), createProject);
router.delete("/:id", protect, deleteProject);

// This is the line that was missing and causing the error
export default router;