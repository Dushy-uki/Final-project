// controllers/applicationController.js
import Job from '../models/Job.js';
import Application from '../models/applicationModel.js';

export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if already applied
    const alreadyApplied = await Application.findOne({ job: jobId, applicant: userId });
    if (alreadyApplied) {
      return res.status(400).json({ error: 'Already applied' });
    }

    // Create new application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      resumeUrl: req.body.resumeUrl,
      message: req.body.message,
    });

    // Also update job's applicant list
    job.applicants.push(userId);
    await job.save();

    res.status(201).json({ message: 'Application submitted', application });
  } catch (err) {
    res.status(500).json({ error: 'Error applying for job' });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company')
      .populate('applicant', 'name email');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching applications' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ message: "Status updated", application });
  } catch (err) {
    res.status(500).json({ error: "Failed to update application" });
  }
};
