import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendMessage);
router.get("/", getMessages);
router.delete("/:id", deleteMessage);

export default router;
