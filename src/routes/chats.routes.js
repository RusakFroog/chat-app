import { Router } from 'express';
import chatsController from '../controllers/chats.controller.js';

const router = Router();

router.get("/all", chatsController.getAllChats);

export default router; 