import express from 'express';
import { generateAndDownloadResume } from '../controllers/generateResumeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/resume/download
router.post('/download', verifyToken, generateAndDownloadResume);

export default router;
