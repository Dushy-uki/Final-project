// routes/applicationRoutes.js
import express from 'express';
import {
  applyForJob,
  getAllApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User applies to a specific job
router.post('/apply/:id', verifyToken, applyForJob);

// Admin gets all applications
router.get('/', verifyToken, isAdmin, getAllApplications);

// Admin updates application status
router.patch('/:id/status', verifyToken, isAdmin, updateApplicationStatus);

export default router;
