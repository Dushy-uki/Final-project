// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import passport from 'passport';
// import './config/passport.js'; // import passport config
// import session from 'express-session';
// const app = express();
// import authRoutes from './routes/authRoutes.js';
// import cors from "cors";    
// import connectDB from "./config/db.js";
// import webhookRoutes from './routes/webhookRoutes.js';
// connectDB(); 

// // Middleware
// // app.use(cors());

// app.use('/api/payments', webhookRoutes);



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }));
// // Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });



// import userRoutes from './routes/userRoutes.js';

// import adminRoutes from './routes/adminRoutes.js';

// import resumeRoutes from './routes/resumeRoutes.js';

// import jobRoutes from './routes/jobRoutes.js';

// import applicationRoutes from './routes/applicationRoutes.js';

// import paymentRoutes from './routes/paymentRoutes.js';

// import groqRoutes from './routes/groqRoutes.js';

// import googleRoutes from './routes/authRoutes.js';

// import providerRoutes from './routes/providerRoutes.js';


// app.use('/api/auth/google', googleRoutes);
// app.use('/api/groq', groqRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/resume', resumeRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/uploads', express.static('uploads'));
// app.use('/api/provider', providerRoutes);


// app.use(cors({
//   origin: 'http://localhost:5173', // frontend URL
//   credentials: true, // cookies use pannina this is needed
// }));



// import fs from 'fs';
// import path from 'path';

// const uploadDir = path.join('uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }


// // Basic Route
// app.get('/', (req, res) => {
//   res.send('Time Pro API is running...');
// });


// // Start Server
// const PORT = process.env.PORT ;
// app.listen(PORT, () => console.log(` Server running on port ${PORT}`));


import express from "express";
import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import './config/passport.js';
import session from 'express-session';
import cors from "cors";
import connectDB from "./config/db.js";

import webhookRoutes from './routes/webhookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import groqRoutes from './routes/groqRoutes.js';
import googleRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';

import fs from 'fs';
import path from 'path';

const app = express();
connectDB();

// 1. Mount webhook route BEFORE any body parser or CORS middleware
app.use('/api/payments', webhookRoutes);

// 2. Now setup CORS and body parsers for all other routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Sessions and Passport
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// 4. Logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// 5. Other routes
app.use('/api/auth/google', googleRoutes);
app.use('/api/groq', groqRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/provider', providerRoutes);

// 6. Ensure upload dir exists
const uploadDir = path.join('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 7. Basic route
app.get('/', (req, res) => {
  res.send('Time Pro API is running...');
});

// 8. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
