import { Router } from 'express';
import homeController from '../controllers/home.controller.js';

const router = Router();

router.get("/", homeController.getHome);

export default router; 