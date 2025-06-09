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

export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already applied' });
    }

    job.applicants.push(req.user.id);
    await job.save();
    res.status(200).json({ message: 'Applied successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error applying for job' });
  }
};
