import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/contactController.js";
import protect from "../middleware/authHandler.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", protect, getMessages);
router.delete("/:id", protect, deleteMessage);

export default router;
