import express from 'express';
import { register, login } from '../controllers/authController.js';
import { resetPassword } from '../controllers/authController.js';
import { forgotPassword } from '../controllers/mailController.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password', forgotPassword);
export default router;
