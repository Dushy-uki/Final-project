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

// export const updateApplicationStatus = async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;

//   try {
//     const application = await Application.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     res.status(200).json({ message: "Status updated", application });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update application" });
//   }
// };
