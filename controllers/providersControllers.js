import Job from '../models/Job.js';

//  Update a job posted by the provider
export const updateProviderJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const providerId = req.user.id;

    const job = await Job.findOne({ _id: jobId, postedBy: providerId });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
};

//  Delete a job posted by the provider
export const deleteProviderJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const providerId = req.user.id;

    const job = await Job.findOneAndDelete({ _id: jobId, postedBy: providerId });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or not authorized' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
