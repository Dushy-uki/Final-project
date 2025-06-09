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

import userRoutes from './routes/userRoutes.js';

import adminRoutes from './routes/adminRoutes.js';

import resumeRoutes from './routes/resumeRoutes.js';
app.use('/api/resume', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


// Basic Route
app.get('/', (req, res) => {
  res.send('Time Pro API is running...');
});


// Start Server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
