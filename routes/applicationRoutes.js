// routes/applicationRoutes.js
import express from 'express';
import {
  applyToJob,
   getMyApplications,
  getAllApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';

import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';

import { uploadResume } from '../middleware/avatarUploadMiddleware.js';



const router = express.Router();

// User applies to a specific job (file upload)
router.post('/apply/:jobId', verifyToken, upload.single('resume'), applyToJob);

// Admin gets all applications
router.get('/', verifyToken, isAdmin, getAllApplications);

// Admin updates application status
router.patch('/:id/status', verifyToken, isAdmin, updateApplicationStatus);

// User gets own applications
router.get('/my', verifyToken,getMyApplications );


export default router;
