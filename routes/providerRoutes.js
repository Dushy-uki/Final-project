import express from 'express';
import {
  postJob,
  getMyJobs,
  updateJob
} from '../controllers/jobController.js';

import {
  getApplicationsByJob,
  updateApplicationStatus
} from '../controllers/applicationController.js';

import {
  updateProviderJob,
  deleteProviderJob,
} from '../controllers/providersControllers.js';

import { verifyToken, isProvider } from '../middleware/authMiddleware.js';

import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// All routes below are protected (JWT required)
router.use(protect);

// ===================== JOB ROUTES =====================

// ✅ POST: Create a new job (provider)
router.post('/jobs', verifyToken, isProvider, postJob);

// ✅ PUT: Update a job posted by the provider
router.put('/jobs/:id', verifyToken, isProvider, updateJob);


// ✅ GET: View all applications for a job posted by the provider
router.get('/jobs/:jobId/applications', verifyToken, isProvider, getApplicationsByJob);

// ✅ PUT: Update status of an application (accept/reject etc.)
router.put('/applications/:id/status', updateApplicationStatus);


// ✅ GET: List all jobs posted by this provider
router.get('/my-jobs', getMyJobs);
router.put('/jobs/:id', verifyToken, isProvider, updateProviderJob);
router.delete('/jobs/:id', verifyToken, isProvider, deleteProviderJob);

export default router;
