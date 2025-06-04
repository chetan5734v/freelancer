const mongoose = require('mongoose');
const { userSchema } = require('./database/tasks');
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
      console.log(`New job "${title}" posted by ${postedBy} in ${category}`);

      // You could implement user preferences/subscriptions here to notify specific users
      // For example: notify users who follow this category or are looking for work

    } catch (notificationError) {
      console.error('Error creating job notification:', notificationError);
    }

    return res.status(200).json({ message: 'Task uploaded', task: newTask });

  } catch (err) {
    console.error('Error uploading task:', err);
    return res.status(500).json({ message: 'Server error while uploading task' });
  }
}

module.exports = {
  UPLOADTASK,
};
