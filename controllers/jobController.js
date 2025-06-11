// controllers/jobController.js
import Job from '../models/Job.js';

export const postJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error while posting job' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email');
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching jobs' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findByIdAndUpdate(jobId, updates, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Error updating job' });
  }
};

