import express from 'express';
import { generateAndDownloadResume } from '../controllers/generateResumeController.js';

const router = express.Router();

// POST /api/resume/download
router.post('/generate', generateAndDownloadResume);

export default router;
