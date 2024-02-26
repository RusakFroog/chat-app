import { Router } from 'express';
import chatController from '../controllers/chat.controller.js';

const router = Router();

router.get("/create", chatController.getCreatingChat);
router.post("/create", chatController.createChat);

router.get("/:id", chatController.getChat);
router.post("/:id/add/message", chatController.addMessage);
router.post("/:id/exit", chatController.exitFromChat);

export default router;