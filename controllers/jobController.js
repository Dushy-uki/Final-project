
import Job from '../models/Job.js';

// ✅ POST a new job (provider only)
export const postJob = async (req, res) => {
  try {
    // Check if the logged-in user is a provider
    if (req.user.role !== 'provider') {
      return res.status(403).json({ error: 'Only providers are allowed to post jobs' });
    }

    // Proceed to create the job with the provider's ID
    const job = await Job.create({ ...req.body, postedBy: req.user.id });

    res.status(201).json(job);
  } catch (err) {
    console.error('Post job error:', err.message);
    res.status(500).json({ error: 'Server error while posting job' });
  }
};


// ✅ GET all jobs (admin, user, provider)
export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const jobs = await Job.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalJobs = await Job.countDocuments();

    res.status(200).json({
      jobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching jobs' });
  }
};

// ✅ GET jobs by provider (only their jobs)
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your jobs' });
  }
};

// ✅ UPDATE a job (provider only or admin)
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Allow both provider (owner) and admin to update
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to update this job' });
    }

    Object.assign(job, updates);
    await job.save();

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Error updating job' });
  }
};
