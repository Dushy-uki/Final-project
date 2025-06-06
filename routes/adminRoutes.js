// routes/adminRoutes.js
import express from 'express';
import { getAllUsers, updateUser, deleteUser } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only access
router.get('/', verifyToken, isAdmin, getAllUsers);
router.put('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
