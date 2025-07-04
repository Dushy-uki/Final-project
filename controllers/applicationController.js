// controllers/applicationController.js
import Job from '../models/Job.js';
import Application from '../models/applicationModel.js';
import User from '../models/user.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


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

// GET applications for a specific job
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    // Validate Job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Authorization
    if (user.role !== 'admin' && job.postedBy.toString() !== user.id) {
      return res.status(403).json({ error: 'Not authorized to view applications for this job' });
    }

    // Fetch applications with applicant details
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email') 
      .select('applicant resumeUrl message status createdAt'); 

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Error fetching applications for this job' });
  }
};

// Update application status - accessible by Admin or Provider who owns the job
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const user = req.user;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const application = await Application.findById(id).populate('job applicant');
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const job = application.job;

    if (user.role !== 'admin' && job.postedBy.toString() !== user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    // Compose email message
    const { email, name } = application.applicant;
    let subject = '';
    let html = '';

    if (status === 'accepted') {
      subject = 'Application Accepted – Interview Invitation';
      html = `<p>Hi ${name},</p>
        <p>Congratulations! Your application for <strong>${job.title}</strong> has been accepted.</p>
        <p>Please attend an interview scheduled for next week. We'll follow up with more details soon.</p>
        <p>– TimePro Team</p>`;
    } else if (status === 'rejected') {
      subject = 'Application Update – Not Selected';
      html = `<p>Hi ${name},</p>
        <p>Thank you for applying for <strong>${job.title}</strong>. After careful review, we regret to inform you that your application was not selected this time.</p>
        <p>Please feel free to apply again for future openings. We appreciate your interest.</p>
        <p>– TimePro Team</p>`;
    }

    if (subject && html) {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject,
        html,
      });
    }

    res.status(200).json({ message: 'Status updated and email sent', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location deadline salary') 
      .sort({ createdAt: -1 }); 

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching your applications' });
  }
};



// USER: Update own profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); 
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update fields from body
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;

    //  Handle uploaded profile image (Cloudinary URL is in req.file.path)
    if (user.avatar = `http://localhost:5000/${req.file.path}`); 


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
