import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  basics: {
    name: String,
    email: String,
    phone: String,
    summary: String
  },
  skills: [{
    name: String,
    level: String
  }],
  education: [{
    institution: String,
    area: String,
    studyType: String,
    startDate: String,
    endDate: String
  }],
  work: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    summary: String
  }],
  generatedAt: { type: Date, default: Date.now },
  fileUrl: String
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
