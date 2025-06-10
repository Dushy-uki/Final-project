import express from 'express';
import { createUser } from '../controllers/adminController.js';
const router = express.Router();

router.post('/', createUser); // POST /api/users



export default router;
