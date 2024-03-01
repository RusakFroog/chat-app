import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

router.get("/getmyname", userController.getMyName);
router.get("/create", userController.getCreatePage);
router.get("/valid/:route", userController.getUserValid);
router.get("/:name", userController.getUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.post("/create", userController.createUser);

export default router;