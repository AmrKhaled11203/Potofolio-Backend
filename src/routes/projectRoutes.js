import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/ProjectController.js";

import upload from "../middleware/upload.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", protect, upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
