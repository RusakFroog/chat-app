import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

//router.get("/", userController.getHome);
router.get("/create", userController.getCreatePage);
router.get("/valid/:route", userController.getUserValid);
router.post("/create", userController.createUser);

export default router;