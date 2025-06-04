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

app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Time Pro API is running...');
});


// Start Server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
