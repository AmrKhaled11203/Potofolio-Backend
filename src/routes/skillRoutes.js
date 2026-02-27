import express from "express";
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getSkills);
router.get("/:id", getSkill);
router.post("/", upload.single("icon"), createSkill);
router.put("/:id", upload.single("icon"), updateSkill);
router.delete("/:id", deleteSkill);

export default router;
