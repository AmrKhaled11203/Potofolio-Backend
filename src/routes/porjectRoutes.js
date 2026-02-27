import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/ProjectController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", upload.single("image"), createProject);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;
