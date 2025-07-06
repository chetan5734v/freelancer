const mongoose = require('mongoose');
const { userSchema } = require('./database/tasks');
const { CHECK_TOKEN_BALANCE, DEDUCT_TOKENS } = require('./tokens');
const uri = 'mongodb://127.0.0.1:27017/dbconnct';

// Connect to MongoDB
mongoose.connect(uri).then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.error('Database connection failed:', err);
});

// Define model
const usermodel = mongoose.model('tasks', userSchema);

// ⬇️ Updated function to emit socket event and create notifications
async function UPLOADTASK(req, res, io) {
  const { title, category, postedBy, status, deadline, createdAt } = req.body;

  try {
    // Check if user has enough tokens (1 token required for posting a job)
    const hasEnoughTokens = await CHECK_TOKEN_BALANCE(postedBy, 1);

    if (!hasEnoughTokens) {
      return res.status(402).json({
        message: 'Insufficient tokens. You need 1 token to post a job.',
        required: 1,
        action: 'purchase_tokens'
      });
    }

    // Deduct 1 token for posting the job
    await DEDUCT_TOKENS(postedBy, 1, 'Job posting');

    const newTask = await usermodel.create({ title, category, postedBy, status, deadline, createdAt });

    // ✅ Emit to all connected clients
    if (io) {
      io.emit('newJob', newTask);
      console.log('New task emitted to clients:', newTask);
    }

    // Create notification for interested users (you can customize this logic)
    try {
      const { CREATE_NOTIFICATION } = require('./features');

      // For now, create a general notification (you could expand this to notify specific users)
      // This is a placeholder - you might want to notify users based on categories they follow
      console.log(`New job "${title}" posted by ${postedBy} in ${category} (1 token deducted)`);

      // You could implement user preferences/subscriptions here to notify specific users
      // For example: notify users who follow this category or are looking for work

    } catch (notificationError) {
      console.error('Error creating job notification:', notificationError);
    }

    return res.status(200).json({
      message: 'Task uploaded successfully! 1 token deducted.',
      task: newTask,
      tokenDeducted: 1
    });

  } catch (err) {
    if (err.message === 'Insufficient tokens') {
      return res.status(402).json({
        message: 'Insufficient tokens. You need 1 token to post a job.',
        required: 1,
        action: 'purchase_tokens'
      });
    }

    console.error('Error uploading task:', err);
    return res.status(500).json({ message: 'Server error while uploading task' });
  }
}

module.exports = {
  UPLOADTASK,
};
