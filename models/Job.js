import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salary: String,
  companyName: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who applied
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
