import express from 'express';
import {
  getAllJobs,
  updateJob,
} from '../controllers/jobController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);                       // Public route to view jobs
router.put('/:id', verifyToken, isAdmin, updateJob); // Admin can update a job

export default router;
