import express from 'express';
// import { generateAndDownloadResume } from '../controllers/generateResumeController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/resume/download
// router.post('/', verifyToken, generateAndDownloadResume);

import { generateResumePDF  } from "../controllers/generateResumeController.js";

router.post("/generate", generateResumePDF);


export default router;