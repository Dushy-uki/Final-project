
export const updateResume = (req, res) => {
  const { jobTitle, tasks, duration, feedback } = req.body;
  const resumeContent = `Worked as ${jobTitle} for ${duration}. Tasks: ${tasks}. Feedback: ${feedback}`;
  res.status(200).json({ resumeContent });
};
 
// controllers/resumeController.js
import Resume from '../models/resume.js';

export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, user: req.user.id });
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create resume' });
  }
};

export const getUserResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};
