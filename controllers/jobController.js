
import Job from '../models/Job.js';

export const createJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Validation error' });
  }
};

export const applyJob = async (req, res) => {
  // mock implementation
  res.status(200).json({ message: 'Application submitted (mock)' });
};
