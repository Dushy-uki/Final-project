import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  name: String,
  email: String,
  phone: String,
  skills: [String],
  experience: String,
  education: String,
  generatedAt: {
    type: Date,
    default: Date.now
  },
  fileUrl: String // optional: if you upload PDF to Cloudinary or S3
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
