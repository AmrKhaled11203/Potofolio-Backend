import express from "express";
import { 
  getProjects, 
  createProject, 
  deleteProject 
} from "../controllers/ProjectController.js";
import upload from "../middleware/upload.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

// Public route
router.get("/", getProjects);

// Protected routes (require login)
router.post("/", protect, upload.single("image"), createProject);
router.delete("/:id", protect, deleteProject);

export default router;
