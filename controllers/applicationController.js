// controllers/applicationController.js
import Job from '../models/Job.js';
import Application from '../models/applicationModel.js';
import User from '../models/user.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

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

// USER: Get own applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location deadline') // show job info
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching your applications' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// controllers/userController.js
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Get user by ID from params
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields from body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;

    // ✅ Handle uploaded profile image (Cloudinary URL is in req.file.path)
    if (req.file && req.file.path) {
      user.avatar = req.file.path; // Cloudinary public URL
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar, // Cloudinary image URL
        role: updatedUser.role,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profile update failed' });
  }
};
