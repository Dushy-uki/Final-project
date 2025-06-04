import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/create-job', authenticate, authorizeRoles('admin'), (req, res) => {
  res.status(201).json({ message: 'Job created successfully (mock)' });
});

export default router;
