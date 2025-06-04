
export const updateResume = (req, res) => {
  const { jobTitle, tasks, duration, feedback } = req.body;
  const resumeContent = `Worked as ${jobTitle} for ${duration}. Tasks: ${tasks}. Feedback: ${feedback}`;
  res.status(200).json({ resumeContent });
};
