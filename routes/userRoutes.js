import express from 'express';
// import { createUser } from '../controllers/adminController.js';
import { updateUserProfile } from '../controllers/applicationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../middleware/avatarUploadMiddleware.js';


const router = express.Router();


router.put(
  '/profile/:id',
  verifyToken,
  uploadAvatar.single('avatar'), //  Use consistent key name: "avatar"
  updateUserProfile
);

export default router;
