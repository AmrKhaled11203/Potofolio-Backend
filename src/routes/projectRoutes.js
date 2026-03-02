import express from "express";
import { 
  getProjects, 
  getProjectById,
  createProject, 
  updateProject,
  deleteProject 
} from "../controllers/ProjectController.js";
import upload from "../middleware/upload.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected routes
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
