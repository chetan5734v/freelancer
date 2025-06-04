const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { authenticateToken, optionalAuth } = require('./middleware/auth');
require('./dbconnect');

// Imports
const { SIGNUP } = require('./signup');
const { SIGNIN } = require('./signin');
const { UPLOADTASK } = require('./uploadtask');
const { JOBS, JOBS1, UPDATE_JOB_STATUS } = require('./jobs');
const { MESSAGES, MESSAGES1, GETALLPOST } = require('./messages');
const {
  GET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  CLEAR_ALL_NOTIFICATIONS,
  GET_FAVORITES,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
  CREATE_NOTIFICATION,
  CREATE_NOTIFICATION_API
} = require('./features');

// App setup
const app = express();
const port = 8002;
const server = http.createServer(app);

// Initialize Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Active chat rooms and users tracking
const activeRooms = new Map();
const connectedUsers = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  // Join chat room
  socket.on('joinRoom', (formData) => {
    socket.join(formData);
    console.log(`Socket ${socket.id} joined room ${formData}`);

    // Track active users in room
    if (!activeRooms.has(formData)) {
      activeRooms.set(formData, new Set());
    }
    activeRooms.get(formData).add(socket.id);

    // Notify room about new user and user count
    io.to(formData).emit('userJoined', {
      users: Array.from(activeRooms.get(formData)),
      userCount: activeRooms.get(formData).size
    });
  });

  // Handle new messages
  socket.on('sendMessage', async ({ formData, newMessage }) => {
    try {
      // Create mock request and response objects for database operation
      const mockReq = {
        body: { formData, newMessage }
      };

      const mockRes = {
        status: (code) => ({
          json: (data) => {
            // Just return data, don't emit here to avoid duplicates
            return data;
          },
          send: (msg) => {
            console.error('Error:', msg);
            socket.emit('messageError', msg);
          }
        })
      };

      // Store message in database
      await MESSAGES1(mockReq, mockRes);

      // Only after successful database save, broadcast to ALL clients in room
      io.to(formData).emit('newMessage', newMessage);

      // Create notification for recipient
      try {
        // Parse room ID to get job and user info
        const roomParts = formData.split('_');

        if (roomParts.length >= 4 && roomParts[0] === 'job') {
          const jobId = roomParts[1];
          const freelancerId = roomParts[3];

          // Get job info to determine recipient
          const { JOBS } = require('./jobs');
          const mockJobReq = { query: {} };

          // Use a Promise to properly handle the async job fetch
          const jobData = await new Promise((resolve, reject) => {
            const mockJobRes = {
              json: (data) => resolve(data),
              status: () => ({ json: (error) => reject(error) })
            };
            JOBS(mockJobReq, mockJobRes);
          });

          const job = jobData.find(j => j._id.toString() === jobId);

          if (job) {
            // Determine recipient (the one who didn't send the message)
            const recipient = newMessage.sender === job.postedBy ? freelancerId : job.postedBy;

            if (recipient && recipient !== newMessage.sender) {
              // Create notification
              const notification = await CREATE_NOTIFICATION(
                recipient,
                'New Message',
                `${newMessage.sender} sent you a message about "${job.title}"`,
                'message',
                jobId,
                formData
              );

              // Emit real-time notification to the recipient
              const notificationData = {
                username: recipient,
                title: 'New Message',
                message: `${newMessage.sender} sent you a message about "${job.title}"`,
                type: 'message',
                jobId: jobId,
                roomId: formData,
                read: false,
                createdAt: new Date()
              };

              io.emit('newNotification', notificationData);
            }
          }
        }
      } catch (notificationError) {
        console.error('Error creating message notification:', notificationError);
      }

      // Emit typing stopped after sending message
      socket.to(formData).emit('userStoppedTyping', socket.id);

    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('messageError', 'Failed to save message');
    }
  });

  // Handle typing status
  socket.on('typing', ({ formData, username }) => {
    socket.to(formData).emit('userTyping', { userId: socket.id, username });
  });

  // Handle stop typing
  socket.on('stopTyping', ({ formData }) => {
    socket.to(formData).emit('userStoppedTyping', socket.id);
  });

  // Handle create notification
  socket.on('createNotification', async ({ username, title, message, type, jobId, roomId }) => {
    try {
      const notification = await CREATE_NOTIFICATION(username, title, message, type, jobId, roomId);

      // Emit notification to the specific user (you'd need to track user sockets for this)
      // For now, we'll emit to all clients (you can improve this later)
      io.emit('newNotification', {
        username,
        title,
        message,
        type,
        jobId,
        roomId,
        read: false,
        createdAt: new Date()
      });

      console.log(`Notification created and emitted for ${username}: ${title}`);
    } catch (error) {
      console.error('Error creating notification:', error);
      socket.emit('notificationError', 'Failed to create notification');
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);

    // Remove from active rooms and notify others
    activeRooms.forEach((users, room) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          activeRooms.delete(room);
        } else {
          // Notify remaining users
          io.to(room).emit('userLeft', {
            userId: socket.id,
            users: Array.from(users)
          });
        }
      }
    });

    // Remove from connected users
    connectedUsers.delete(socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('error', 'An error occurred');
  });
});

// Routes
app.get('/', (req, res) => {
  res.send("Server is running");
});

app.post('/signup', SIGNUP);
app.post('/signin', SIGNIN);

// Protected routes (require authentication)
app.post('/task', authenticateToken, (req, res) => UPLOADTASK(req, res, io));
app.post('/jobs/update-status', authenticateToken, UPDATE_JOB_STATUS);
app.post('/messages', authenticateToken, MESSAGES);
app.post('/messages1', authenticateToken, MESSAGES1);
app.post('/getAllForPost', authenticateToken, GETALLPOST);

// New feature routes
app.post('/notifications', authenticateToken, GET_NOTIFICATIONS);
app.post('/notifications/create', authenticateToken, CREATE_NOTIFICATION_API);
app.post('/notifications/mark-read', authenticateToken, MARK_NOTIFICATION_READ);
app.post('/notifications/clear-all', authenticateToken, CLEAR_ALL_NOTIFICATIONS);
app.post('/favorites', authenticateToken, GET_FAVORITES);
app.post('/favorites/add', authenticateToken, ADD_FAVORITE);
app.post('/favorites/remove', authenticateToken, REMOVE_FAVORITE);

// Public routes (optional authentication)
app.get('/api/documents', optionalAuth, JOBS);

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// Export io for use in other modules
module.exports = { io };