import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";

import upload from "../middleware/upload.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.get("/", getSettings);
router.put(
  "/",
  protect,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateSettings,
);

export default router;
