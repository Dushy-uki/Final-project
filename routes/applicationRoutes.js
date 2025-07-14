// routes/applicationRoutes.js
import express from 'express';
import {
  applyToJob,
  deleteMyApplication,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { uploadResume } from '../middleware/avatarUploadMiddleware.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';




const router = express.Router();


// Correct order — specific before dynamic
router.get('/my', verifyToken, getMyApplications); //  Put this first

router.post('/apply/:jobId', verifyToken, uploadResume.single('resume'), applyToJob);

router.get('/:jobId', verifyToken, isAdmin, getApplicationsByJob); //  Dynamic param LAST
router.patch('/:id/status', verifyToken, isAdmin, updateApplicationStatus);
router.delete('/:id', verifyToken, deleteMyApplication); // Delete application by ID

export default router;
