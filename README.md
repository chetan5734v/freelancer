# FreelanceVerse 🌍

**A Modern Student-Focused Freelancing Platform**

FreelanceVerse is a comprehensive freelancing platform designed specifically for students and young professionals. It provides a seamless experience for posting jobs, finding freelance opportunities, managing projects, and facilitating communication between clients and freelancers.

![FreelanceVerse Demo](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**: Secure signup/signin with JWT tokens
- **Job Management**: Post, browse, and manage freelance jobs
- **Real-time Chat**: Instant messaging between clients and freelancers
- **Job Status Tracking**: Track progress from "Open" → "In Progress" → "Completed"
- **Favorites System**: Save and manage favorite job listings
- **Notifications**: Real-time notifications for job applications and messages

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic HTML
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Search & Filter**: Advanced job search and categorization
- **Profile Management**: Comprehensive user profiles and statistics

### 🔧 Technical Features
- **Real-time Communication**: Socket.io for instant messaging
- **RESTful API**: Well-structured backend with Express.js
- **Data Validation**: Comprehensive input validation and error handling
- **Security**: Protected routes with authentication middleware
- **Scalable Architecture**: Modular component structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShivamBailwal/Freelancing-website.git
   cd Freelancing-website
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/freelanceverse
   JWT_SECRET=your_jwt_secret_key_here
   PORT=8002
   ```

4. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   node server.js
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8002

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header with search and notifications
│   ├── Footer.js       # Application footer
│   └── Layout.js       # Main layout wrapper
├── pages/              # Main application pages
│   ├── home.js         # Landing page
│   ├── homepage.js     # User dashboard
│   ├── job-details.js  # Individual job details and management
│   ├── world.js        # Job listings page
│   ├── messages.js     # Message inbox
│   ├── chat.js         # Real-time chat interface
│   ├── profile.js      # User profile management
│   ├── favorites.js    # Saved job listings
│   ├── notifications.js # Notification center
│   └── search.js       # Advanced job search
├── utils/              # Utility functions
│   └── api.js          # API configuration and helpers
└── context/            # React context providers
    └── NotificationContext.js
```

## 🔄 Job Workflow

1. **Job Posting**: Clients create job listings with details, deadlines, and categories
2. **Discovery**: Freelancers browse jobs using search and filter options
3. **Application**: Interested freelancers apply and start chat conversations
4. **Communication**: Real-time messaging for project discussion
5. **Status Management**: Job owners can update status through the project lifecycle
6. **Completion**: Projects marked as completed with proper tracking

## 🛠️ API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /signin` - User login

### Jobs
- `GET /api/documents` - Fetch all jobs
- `POST /task` - Create new job (protected)
- `POST /jobs/update-status` - Update job status (protected)

### Messaging
- `POST /messages` - Get user messages (protected)
- `POST /messages1` - Send message (protected)

### Features
- `POST /notifications` - Get notifications (protected)
- `POST /favorites` - Get user favorites (protected)
- `POST /favorites/add` - Add to favorites (protected)
- `POST /favorites/remove` - Remove from favorites (protected)

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb)
- **Success**: Green (#059669)
- **Warning**: Yellow (#d97706)
- **Error**: Red (#dc2626)
- **Neutral**: Gray shades

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Monospace fonts

### Icons
All emoji icons are implemented with proper accessibility:
- 🔍 Search functionality
- 💬 Chat and messaging
- 📋 Documentation and details
- ⭐ Favorites and ratings
- 🔔 Notifications
- 📊 Statistics and status

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware for route protection
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Graceful error management

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Frontend Validation**: Form validation with user feedback
- **Backend Validation**: Server-side data validation
- **Error Boundaries**: React error boundaries for graceful failures
- **API Error Handling**: Proper HTTP status codes and error messages

## 📈 Performance Optimizations

- **Lazy Loading**: Component lazy loading for better performance
- **Code Splitting**: Optimized bundle splitting
- **Image Optimization**: Efficient image loading and caching
- **API Optimization**: Efficient data fetching and caching

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use Tailwind CSS for styling
- Ensure accessibility compliance
- Add proper error handling
- Write descriptive commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shivam Bailwal** - *Initial work* - [@ShivamBailwal](https://github.com/ShivamBailwal)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- Socket.io for real-time communication capabilities
- MongoDB for flexible data storage

## 📞 Support

If you have any questions or need support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for the freelancing community**

## 🔧 Development Notes

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and includes additional features:

### Recent Updates
- ✅ Fixed emoji icon accessibility across all pages
- ✅ Implemented job status management system
- ✅ Added real-time notifications
- ✅ Enhanced responsive design
- ✅ Improved error handling and validation

### Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**
