import express from 'express';
import {
  postJob,
  getAllJobs,
  updateJob,
} from '../controllers/jobController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, postJob);   // Only admin can post a job
router.get('/', getAllJobs);                       // Public route to view jobs
router.put('/:id', verifyToken, isAdmin, updateJob); // Admin can update a job

export default router;
