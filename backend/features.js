const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true }, // 'job', 'message', 'job_application'
  jobId: String,
  roomId: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const favoriteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  jobId: { type: String, required: true },
  title: String,
  category: String,
  postedBy: String,
  status: String,
  deadline: Date,
  savedAt: { type: Date, default: Date.now }
});

const NotificationModel = mongoose.model('notifications', notificationSchema);
const FavoriteModel = mongoose.model('favorites', favoriteSchema);

// Notification functions
async function GET_NOTIFICATIONS(req, res) {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const notifications = await NotificationModel.find({ username })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
}

async function CREATE_NOTIFICATION(username, title, message, type, jobId = null, roomId = null) {
  try {
    const notification = await NotificationModel.create({
      username,
      title,
      message,
      type,
      jobId,
      roomId,
      read: false
    });
    console.log(`Notification created for ${username}: ${title}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

async function MARK_NOTIFICATION_READ(req, res) {
  try {
    const { notificationId } = req.body;

    await NotificationModel.findByIdAndUpdate(notificationId, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
}

async function CLEAR_ALL_NOTIFICATIONS(req, res) {
  try {
    const { username } = req.body;

    await NotificationModel.deleteMany({ username });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({ message: 'Error clearing notifications' });
  }
}

// Favorite functions
async function GET_FAVORITES(req, res) {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const favorites = await FavoriteModel.find({ username })
      .sort({ savedAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
}

async function ADD_FAVORITE(req, res) {
  try {
    const { username, jobId, title, category, postedBy, status, deadline } = req.body;

    // Check if already favorited
    const existing = await FavoriteModel.findOne({ username, jobId });
    if (existing) {
      return res.status(400).json({ message: 'Job already in favorites' });
    }

    await FavoriteModel.create({
      username,
      jobId,
      title,
      category,
      postedBy,
      status,
      deadline
    });

    res.json({ message: 'Job added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite' });
  }
}

async function REMOVE_FAVORITE(req, res) {
  try {
    const { username, jobId } = req.body;

    await FavoriteModel.deleteOne({ username, jobId });
    res.json({ message: 'Job removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
}

async function CREATE_NOTIFICATION_API(req, res) {
  try {
    const { username, title, message, type, jobId = null, roomId = null } = req.body;

    if (!username || !title || !message || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await CREATE_NOTIFICATION(username, title, message, type, jobId, roomId);
    res.json({ message: 'Notification created successfully' });
  } catch (error) {
    console.error('Error creating notification via API:', error);
    res.status(500).json({ message: 'Error creating notification' });
  }
}

module.exports = {
  GET_NOTIFICATIONS,
  CREATE_NOTIFICATION,
  CREATE_NOTIFICATION_API,
  MARK_NOTIFICATION_READ,
  CLEAR_ALL_NOTIFICATIONS,
  GET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  NotificationModel,
  FavoriteModel
};
