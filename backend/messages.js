// backend/messages.js

const mongoose = require('mongoose');
const { UserModel } = require('./database/user');

const messageSchema = new mongoose.Schema({
  formData: {
    type: String, // optional: split into sender/receiver
    required: true,
  },
  messages: [
    {
      sender: String,
      text: String,
      timestamp: Date,
    }
  ]
});

// Create model
const MessageModel = mongoose.model('messages', messageSchema);

// Check if user can message (must have applied for the job first)
async function CHECK_MESSAGING_ELIGIBILITY(username, jobId) {
  try {
    console.log('=== MESSAGING ELIGIBILITY CHECK ===');
    console.log('Username:', username);
    console.log('Job ID:', jobId);

    const user = await UserModel.findOne({ username });

    if (!user) {
      console.log('User not found');
      return { eligible: false, reason: 'User not found' };
    }

    // Get all job application transactions
    const jobApplications = user.tokenHistory.filter(transaction =>
      transaction.type === 'deduct' &&
      transaction.purpose.includes('Applied for job')
    );

    console.log('All job applications by user:', jobApplications);

    // Check if user applied for this specific job
    const hasAppliedForThisJob = jobApplications.some(transaction =>
      transaction.purpose.includes(jobId) || transaction.purpose.includes(`ID: ${jobId}`)
    );

    // For immediate access after application - check for very recent applications (extended to 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const hasVeryRecentApplication = jobApplications.some(transaction => {
      const transactionDate = transaction.timestamp || transaction.date;
      return transactionDate && new Date(transactionDate) > tenMinutesAgo;
    });

    console.log('Applied for this job specifically:', hasAppliedForThisJob);
    console.log('Has very recent application (10min):', hasVeryRecentApplication);

    // User is eligible if they applied for this specific job OR have a very recent application
    const isEligible = hasAppliedForThisJob || hasVeryRecentApplication;

    console.log('Final eligibility result:', isEligible);
    console.log('=== END ELIGIBILITY CHECK ===');

    if (!isEligible) {
      return {
        eligible: false,
        reason: 'You must apply for this job first before messaging the job owner.'
      };
    }

    return { eligible: true, reason: 'User is eligible to message' };
  } catch (error) {
    console.error('Error checking messaging eligibility:', error);
    return { eligible: false, reason: 'Error checking eligibility' };
  }
}

// Create or update a message thread
async function MESSAGES(req, res) {
  try {
    const { formData, newMessage } = req.body;

    if (!formData || !newMessage) {
      return res.status(400).send('formData and newMessage are required');
    }

    // Parse room ID to extract job and freelancer info
    const roomParts = formData.split('_');
    if (roomParts.length >= 4 && roomParts[0] === 'job' && roomParts[2] === 'freelancer') {
      const jobId = roomParts[1];
      const freelancerName = roomParts[3];

      // Get job info to determine if sender is job owner or freelancer
      const { JOBS } = require('./jobs');
      const mockJobReq = { query: {} };
      const jobData = await new Promise((resolve, reject) => {
        const mockJobRes = {
          json: (data) => resolve(data),
          status: () => ({ json: (error) => reject(error) })
        };
        JOBS(mockJobReq, mockJobRes);
      });

      const job = jobData.find(j => j._id.toString() === jobId);

      if (job) {
        const isJobOwner = newMessage.sender === job.postedBy;

        // Only check eligibility for freelancers, not job owners
        if (!isJobOwner) {
          const eligibility = await CHECK_MESSAGING_ELIGIBILITY(newMessage.sender, jobId);

          if (!eligibility.eligible) {
            return res.status(403).json({
              message: eligibility.reason,
              action: 'apply_first'
            });
          }
        }
      }
    }

    const existingThread = await MessageModel.findOne({ formData });

    if (existingThread) {
      existingThread.messages.push(newMessage);
      await existingThread.save();
      console.log(`Added message to existing thread: ${formData}`);
      return res.send(formData);
    } else {
      await MessageModel.create({
        formData,
        messages: [newMessage],
      });
      console.log(`Created new message thread: ${formData}`);
      return res.send(formData);
    }
  } catch (err) {
    console.error('Error in MESSAGES:', err);
    res.status(500).send('Error creating/updating message');
  }
}


async function MESSAGES1(req, res) {
  try {
    const { formData, newMessage } = req.body;

    if (!formData) {
      return res.status(400).send('formData is required');
    }

    let thread = await MessageModel.findOne({ formData });

    if (newMessage && newMessage.text && newMessage.text.trim()) {
      // Adding a new message - check eligibility for freelancers
      const roomParts = formData.split('_');
      if (roomParts.length >= 4 && roomParts[0] === 'job' && roomParts[2] === 'freelancer') {
        const jobId = roomParts[1];

        // Get job info to determine if sender is job owner or freelancer
        const { JOBS } = require('./jobs');
        const mockJobReq = { query: {} };
        const jobData = await new Promise((resolve, reject) => {
          const mockJobRes = {
            json: (data) => resolve(data),
            status: () => ({ json: (error) => reject(error) })
          };
          JOBS(mockJobReq, mockJobRes);
        });

        const job = jobData.find(j => j._id.toString() === jobId);

        if (job) {
          const isJobOwner = newMessage.sender === job.postedBy;

          // Only check eligibility for freelancers, not job owners
          if (!isJobOwner) {
            const eligibility = await CHECK_MESSAGING_ELIGIBILITY(newMessage.sender, jobId);

            if (!eligibility.eligible) {
              return res.status(403).json({
                message: eligibility.reason,
                action: 'apply_first'
              });
            }
          }
        }
      }

      if (!thread) {
        thread = new MessageModel({ formData, messages: [] });
      }

      thread.messages.push(newMessage);
      await thread.save();
      console.log(`Message saved to thread ${formData}: ${newMessage.text.substring(0, 50)}...`);
      return res.status(200).json(newMessage);
    } else {
      // Fetching existing messages
      if (!thread) {
        console.log(`No thread found for ${formData}, returning empty array`);
        return res.status(200).json([]);
      }
      console.log(`Retrieved ${thread.messages.length} messages for thread ${formData}`);
      return res.status(200).json(thread.messages);
    }
  } catch (err) {
    console.error('Error in MESSAGES1:', err);
    return res.status(500).send('Server error');
  }
}

async function GETALLPOST(req, res) {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).send('postId is required');
    }    // Find all threads for this job using the new room ID format
    // Format: job_${jobId}_freelancer_${freelancerId}
    const threads = await MessageModel.find({
      formData: { $regex: `^job_${postId}_freelancer_` }
    });

    console.log(`Found ${threads.length} message threads for job ${postId}`);
    res.json(threads);
  } catch (err) {
    console.error('Error retrieving message threads:', err);
    res.status(500).send('Error retrieving message threads');
  }
}




module.exports = {
  MESSAGES,
  MESSAGES1,
  GETALLPOST,
  CHECK_MESSAGING_ELIGIBILITY,
};
