// routes/jobRoutes.js
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { createJob, applyJob } from '../controllers/jobController.js';

const router = express.Router();

router.post('/admin/jobs', authenticate, authorizeRoles('admin'), createJob);
router.post('/jobs/:id/apply', authenticate, authorizeRoles('student'), applyJob);

export default router;
