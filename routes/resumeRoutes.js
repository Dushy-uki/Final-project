import express from 'express';
import { createResume, getUserResume } from '../controllers/resumeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createResume);
router.get('/', verifyToken, getUserResume);

export default router;