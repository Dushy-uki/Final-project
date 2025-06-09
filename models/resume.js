// models/resume.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: String,
  email: String,
  phone: String,
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      description: String,
    },
  ],
  skills: [String],
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Resume', resumeSchema);
