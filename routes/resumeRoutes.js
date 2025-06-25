import express from 'express';
import { generateResume } from '../controllers/generateResumeController.js';
// import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', generateResume);

export default router;
