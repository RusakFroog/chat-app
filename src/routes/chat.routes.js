import { Router } from 'express';
import chatController from '../controllers/chat.controller.js';

const router = Router();

router.get("/:id", chatController.getChat);
router.post("/:id/add/message", chatController.addMessage);

export default router; 