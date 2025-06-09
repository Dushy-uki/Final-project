
import express from 'express';
import { updateResume } from '../controllers/aiController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/resume-update', authenticate, updateResume);

export default router;

