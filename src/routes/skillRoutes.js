import express from "express";
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import upload from "../middleware/upload.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", protect, upload.single("icon"), createSkill);
router.put("/:id", protect, upload.single("icon"), updateSkill);
router.delete("/:id", protect, deleteSkill);

export default router;
