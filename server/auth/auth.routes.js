// define auth routes
import { Router } from 'express';
import AuthController from './auth.controller.js';

const router = Router();

const authController = new AuthController();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.get('/logout', authController.logout.bind(authController));

export default router;
