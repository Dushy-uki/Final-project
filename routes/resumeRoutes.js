// routes/resume.js
import express from 'express';
import { generateResumeWithGroq } from '../controllers/generateResumeController.js';

const router = express.Router();

router.post('/generate', generateResumeWithGroq);

export default router;
