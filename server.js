import express from "express";
import dotenv from "dotenv";
dotenv.config();
// import User from '../models/User.js';   

const app = express();

import authRoutes from './routes/authRoutes.js';

import cors from "cors";    
import connectDB from "./config/db.js";
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRoutes from './routes/userRoutes.js';

import adminRoutes from './routes/adminRoutes.js';

import resumeRoutes from './routes/resumeRoutes.js';

import jobRoutes from './routes/jobRoutes.js';

import applicationRoutes from './routes/applicationRoutes.js';

import paymentRoutes from './routes/paymentRoutes.js';

app.use('/api/payment', paymentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


import fs from 'fs';
import path from 'path';

const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// Basic Route
app.get('/', (req, res) => {
  res.send('Time Pro API is running...');
});


// Start Server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
