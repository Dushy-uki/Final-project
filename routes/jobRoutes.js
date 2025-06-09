import express from 'express';
import { postJob, getAllJobs, applyForJob } from '../controllers/jobController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllJobs);             // Anyone can see all jobs
router.post('/', verifyToken, isAdmin, postJob);       // Only admin can post
router.post('/apply/:id', verifyToken, applyForJob);   // User applies to job

export default router;
