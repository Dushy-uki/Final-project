import express from "express";
import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import './config/passport.js'; // import passport config
import session from 'express-session';
const app = express();
import authRoutes from './routes/authRoutes.js';
import cors from "cors";    
import connectDB from "./config/db.js";
connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }));
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

import userRoutes from './routes/userRoutes.js';

import adminRoutes from './routes/adminRoutes.js';

import resumeRoutes from './routes/resumeRoutes.js';

import jobRoutes from './routes/jobRoutes.js';

import applicationRoutes from './routes/applicationRoutes.js';

import paymentRoutes from './routes/paymentRoutes.js';

import groqRoutes from './routes/groqRoutes.js';

import googleRoutes from './routes/authRoutes.js';
app.use('/api/auth', googleRoutes);

// Groq AI Chat Route
app.use('/api/groq', groqRoutes);
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
