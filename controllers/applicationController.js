// controllers/applicationController.js
import Job from '../models/Job.js';
import Application from '../models/applicationModel.js';

// USER: Apply for a Job (with file upload)
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;
    const { message } = req.body;

    if (!req.file || !message) {
      return res.status(400).json({ error: 'Resume file and message are required' });
    }

    const resumePath = req.file.path;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check for duplicate application
    const existing = await Application.findOne({ job: jobId, applicant: userId });
    if (existing) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create new application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      resumeUrl: resumePath,
      message,
    });

    // Optional: Save applicant ID to job model (if needed)
    if (!job.applicants.includes(userId)) {
      job.applicants.push(userId);
      await job.save();
    }

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
};

// ADMIN: Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title')
      .populate('applicant', 'name email');

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching applications' });
  }
};

// ADMIN: Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({ message: 'Status updated', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
};
