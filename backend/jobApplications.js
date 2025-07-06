const { CHECK_TOKEN_BALANCE, DEDUCT_TOKENS } = require('./tokens');
const { CREATE_NOTIFICATION } = require('./features');

// Apply for a job (requires 1 token)
async function APPLY_FOR_JOB(req, res) {
  try {
    console.log('APPLY_FOR_JOB called');
    console.log('Request body:', req.body);
    console.log('Authenticated user:', req.user);
    
    // Get username from authenticated user (more secure)
    const username = req.user?.username;
    const { jobId, jobTitle, jobOwner } = req.body;

    if (!username) {
      console.log('No username found in authenticated user');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!jobId || !jobTitle || !jobOwner) {
      console.log('Missing required fields:', { jobId, jobTitle, jobOwner });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Processing job application for:', { username, jobId, jobTitle, jobOwner });

    // Check if user has enough tokens (1 token required for job application)
    const hasEnoughTokens = await CHECK_TOKEN_BALANCE(username, 1);

    if (!hasEnoughTokens) {
      return res.status(402).json({
        message: 'Insufficient tokens. You need 1 token to apply for a job.',
        required: 1,
        action: 'purchase_tokens'
      });
    }

    // Deduct 1 token for job application
    const newBalance = await DEDUCT_TOKENS(username, 1, `Applied for job: ${jobTitle} (ID: ${jobId})`);

    // Create notification for job owner
    await CREATE_NOTIFICATION(
      jobOwner,
      'New Job Application',
      `${username} applied for your job "${jobTitle}"`,
      'job_application',
      jobId,
      `job_${jobId}_freelancer_${username}`
    );

    console.log(`${username} applied for job ${jobId} (1 token deducted)`);

    res.json({
      message: 'Application submitted successfully! 1 token deducted.',
      tokenDeducted: 1,
      newBalance: newBalance,
      roomId: `job_${jobId}_freelancer_${username}`
    });

  } catch (error) {
    if (error.message === 'Insufficient tokens') {
      return res.status(402).json({
        message: 'Insufficient tokens. You need 1 token to apply for a job.',
        required: 1,
        action: 'purchase_tokens'
      });
    }

    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Error processing job application' });
  }
}

// Check if user can message (must have applied for the job first)
async function CHECK_MESSAGING_ELIGIBILITY(req, res) {
  try {
    const { username, jobId } = req.body;

    if (!username || !jobId) {
      return res.status(400).json({ message: 'Username and jobId are required' });
    }

    // Check if user has at least applied for this job (check token history)
    const { UserModel } = require('./database/user');
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a token transaction for this job
    const hasApplied = user.tokenHistory.some(transaction =>
      transaction.type === 'deduct' &&
      transaction.purpose.includes('Applied for job') &&
      transaction.purpose.includes(jobId)
    );

    if (!hasApplied) {
      return res.status(403).json({
        message: 'You must apply for this job first before messaging the job owner.',
        action: 'apply_first'
      });
    }

    res.json({
      eligible: true,
      message: 'User is eligible to message for this job'
    });

  } catch (error) {
    console.error('Error checking messaging eligibility:', error);
    res.status(500).json({ message: 'Error checking messaging eligibility' });
  }
}

module.exports = {
  APPLY_FOR_JOB,
  CHECK_MESSAGING_ELIGIBILITY
};
