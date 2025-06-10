// routes/jobRoutes.js
import express from 'express';
import { postJob, getAllJobs } from '../controllers/jobController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin can post a job
router.post('/', verifyToken, isAdmin, postJob);

// Anyone logged in can see jobs
router.get('/', verifyToken, getAllJobs);

export default router;
