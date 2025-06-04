# Freelancing Platform - Real-time Chat Setup Guide

## 🚀 Features Implemented

### Real-time Chat System
- **Socket.IO Integration**: Real-time bidirectional communication
- **Message Persistence**: All messages stored in MongoDB
- **Room-based Chat**: Users automatically join chat rooms based on post ID
- **Auto-scroll**: Messages automatically scroll to bottom
- **Error Handling**: Comprehensive error handling for connection issues
- **Session Storage**: Local message caching for better UX

### Backend Features
- **User Authentication**: Sign up/Sign in with MongoDB storage
- **Task Management**: Upload and retrieve tasks/jobs
- **Message Threading**: Organized conversations by post ID
- **Database Connection**: Centralized MongoDB connection

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install express cors mongoose socket.io
node server.js
```

### Frontend Setup
```bash
cd ../
npm install
npm start
```

## 📁 Project Structure

```
frelelancing-main/
├── backend/
│   ├── server.js           # Main server with Socket.IO
│   ├── dbconnect.js        # Database connection
│   ├── messages.js         # Message handling logic
│   ├── signin.js           # User authentication
│   ├── signup.js           # User registration
│   ├── jobs.js             # Job/task management
│   └── database/
│       ├── user.js         # User schema
│       └── tasks.js        # Task schema
├── src/
│   ├── pages/
│   │   ├── chat.js         # Real-time chat component
│   │   ├── messages.js     # Message list component
│   │   ├── signin.js       # Sign in page
│   │   └── signup.js       # Sign up page
│   └── App.js              # Main routing
└── package.json
```

## 🔧 Configuration

### Server Configuration (server.js)
- **Port**: 8002 (backend)
- **CORS**: Configured for localhost:3000
- **Socket.IO**: Real-time communication
- **MongoDB**: Connection to local database

### Frontend Configuration
- **Port**: 3000 (React app)
- **Socket.IO Client**: Connects to localhost:8002
- **API Endpoints**: All pointing to localhost:8002

## 🌐 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /signin` - User login

### Tasks/Jobs
- `POST /task` - Upload new task
- `GET /api/documents` - Get all tasks

### Messages
- `POST /messages` - Create/update message thread
- `POST /messages1` - Handle individual messages
- `POST /getAllForPost` - Get all messages for a post

## 🔄 Real-time Events

### Client → Server
- `joinRoom(formData)` - Join chat room
- `sendMessage({formData, newMessage})` - Send new message
- `typing({formData, username})` - User typing indicator
- `stopTyping({formData})` - Stop typing indicator

### Server → Client
- `newMessage(message)` - Broadcast new message
- `messageError(error)` - Message error notification
- `userJoined({users})` - User joined room
- `userLeft({userId, users})` - User left room
- `userTyping({userId, username})` - Typing indicator
- `userStoppedTyping(userId)` - Stop typing indicator

## 🎯 Usage

### Starting a Chat
1. Sign up/Sign in to the platform
2. Navigate to `/messages/:postId` 
3. Click to start chat → redirects to `/chat/:postId`
4. Real-time messaging begins automatically

### Message Flow
1. User types message and hits Send
2. Message sent via Socket.IO to server
3. Server saves to MongoDB and broadcasts to room
4. All users in room receive message instantly
5. UI updates automatically with new message

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :8002
# Kill process
taskkill /PID <PID> /F
```

**MongoDB Connection Issues**
- Ensure MongoDB is running on localhost:27017
- Check database name: 'dbconnct'

**Socket.IO Connection Issues**
- Verify backend is running on port 8002
- Check CORS configuration
- Ensure frontend connects to correct URL

### Error Messages
- `messageError`: Check server logs and MongoDB connection
- `Connection failed`: Verify Socket.IO server is running
- `User not found`: Check authentication and localStorage

## 🔒 Security Notes

⚠️ **Current Implementation** (Development Only):
- Passwords stored in plain text
- No JWT authentication
- Basic input validation

🔐 **Recommended for Production**:
- Hash passwords with bcrypt
- Implement JWT tokens
- Add rate limiting
- Input sanitization
- HTTPS only

## 🚀 Next Steps

### Enhancements to Consider
1. **File Sharing**: Upload and share files in chat
2. **Message Reactions**: Add emoji reactions
3. **Message Search**: Search through chat history
4. **Push Notifications**: Browser notifications for new messages
5. **User Status**: Online/offline indicators
6. **Message Threading**: Reply to specific messages
7. **Chat History**: Pagination for large conversations

### Performance Optimizations
1. **Message Pagination**: Load messages in chunks
2. **Connection Pooling**: Optimize database connections
3. **Caching**: Redis for frequently accessed data
4. **CDN**: Static asset delivery

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services are running
3. Check network connectivity
4. Review the troubleshooting section above

---

**Happy Coding! 🎉**
