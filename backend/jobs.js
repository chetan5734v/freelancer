const mongoose = require('mongoose');
const { userSchema } = require('./database/tasks');
const uri = 'mongodb://127.0.0.1:27017/dbconnct';

mongoose.connect(uri).then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.error('Database connection failed:', err);
});
const JobModel = mongoose.model('tasks', userSchema);

async function JOBS(req, res) {
  try {
    const docs = await JobModel.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch document IDs" });
  }
}

async function UPDATE_JOB_STATUS(req, res) {
  try {
    const { jobId, status, postedBy } = req.body;

    if (!jobId || !status || !postedBy) {
      return res.status(400).json({ error: "Missing required fields: jobId, status, postedBy" });
    }

    // Valid statuses
    const validStatuses = ['Open', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be: Open, In Progress, or Completed" });
    }

    // Find the job and verify ownership
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.postedBy !== postedBy) {
      return res.status(403).json({ error: "You can only update your own jobs" });
    }

    // Update the job status
    const updatedJob = await JobModel.findByIdAndUpdate(
      jobId,
      { status: status },
      { new: true }
    );

    console.log(`Job ${jobId} status updated to ${status} by ${postedBy}`);
    res.json({
      message: "Job status updated successfully",
      job: updatedJob
    });

  } catch (err) {
    console.error('Error updating job status:', err);
    res.status(500).json({ error: "Failed to update job status" });
  }
}

module.exports = {
  JOBS,
  UPDATE_JOB_STATUS
};