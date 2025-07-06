import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function CHAT() {
  const [messageData, setMessageData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [chatPartner, setChatPartner] = useState('');
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { postId } = useParams(); // This is the room ID from navigation
  const location = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // Helper function to create consistent room ID
  const createRoomId = (jobId, freelancerName) => {
    return `job_${jobId}_freelancer_${freelancerName}`;
  };

  // Extract job and user info from room ID
  const parseRoomId = (roomId) => {
    const parts = roomId.split('_');
    if (parts.length >= 3 && parts[0] === 'job' && parts[2] === 'freelancer') {
      return {
        jobId: parts[1],
        freelancerName: parts[3]
      };
    }
    return null;
  };
  useEffect(() => {
    const initializeChat = async () => {
      console.log('=== CHAT INITIALIZATION ===');
      console.log('PostId (roomId):', postId);
      console.log('Location state:', location.state);

      if (!isAuthenticated()) {
        console.log('User not authenticated, redirecting to signin');
        alert('Please sign in to access chat.');
        navigate('/signin');
        return;
      }

      try {
        const currentUser = getCurrentUser();
        console.log('Current user:', currentUser);
        setUser(currentUser);

        // Parse room information
        const roomInfo = parseRoomId(postId);
        console.log('Parsed room info:', roomInfo);
        
        if (!roomInfo) {
          console.error('Invalid room ID format:', postId);
          alert('Invalid chat room format. Please try again.');
          navigate('/world');
          return;
        }

        // Fetch job information
        console.log('Fetching job information for jobId:', roomInfo.jobId);
        const jobsResponse = await api.get(`/api/documents`);
        const jobs = jobsResponse.data;
        const job = jobs.find(j => j._id === roomInfo.jobId);
        
        console.log('Found job:', job);

        if (job) {
          setJobInfo(job);

          // Determine chat partner and check eligibility
          const isJobOwner = currentUser.username === job.postedBy;
          console.log('Is job owner:', isJobOwner);
          
          if (isJobOwner) {
            // Job owner chatting with freelancer
            setChatPartner(`Freelancer (${roomInfo.freelancerName})`);
            console.log('Chat partner set as freelancer:', roomInfo.freelancerName);
          } else {
            // Freelancer chatting with job owner - check eligibility
            setChatPartner(job.postedBy);
            console.log('Chat partner set as job owner:', job.postedBy);

            // Check if freelancer is eligible to message
            console.log('Checking messaging eligibility...');
            try {
              const eligibilityResponse = await api.post('/messages/check-eligibility', {
                username: currentUser.username,
                jobId: roomInfo.jobId
              });

              console.log('Eligibility response:', eligibilityResponse.data);

              if (!eligibilityResponse.data.eligible) {
                console.log('User not eligible for messaging');
                alert('You must apply for this job first before messaging the job owner.');
                navigate(`/job/${roomInfo.jobId}`);
                return;
              }
              
              console.log('User is eligible for messaging');
            } catch (error) {
              console.error('Error checking messaging eligibility:', error);
              if (error.response && error.response.status === 403) {
                alert('You must apply for this job first before messaging the job owner.');
                navigate(`/job/${roomInfo.jobId}`);
                return;
              }
            }
          }
        } else {
          console.error('Job not found for ID:', roomInfo.jobId);
          alert('Job not found. Please try again.');
          navigate('/world');
          return;
        }

        // Initialize socket connection
        socketRef.current = io('http://localhost:8002', {
          transports: ['websocket', 'polling']
        });

        // Join the chat room
        socketRef.current.emit('joinRoom', postId);
        console.log('Joined room:', postId);

        // Set up socket event listeners
        setupSocketListeners(currentUser);

        // Load existing messages
        await loadMessages(postId);

      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('stopTyping', { formData: postId });
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [postId, navigate]);
  const setupSocketListeners = (currentUser) => {
    // Remove any existing listeners to prevent duplicates
    socketRef.current.off('newMessage');
    socketRef.current.off('userTyping');
    socketRef.current.off('userStoppedTyping');
    socketRef.current.off('connect');
    socketRef.current.off('disconnect');
    socketRef.current.off('messageError');    // Listen for new messages
    socketRef.current.on('newMessage', (newMessage) => {
      console.log('Received new message:', newMessage);
      setMessageData(prev => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg =>
          msg.id === newMessage.id ||
          (msg.sender === newMessage.sender &&
            msg.text === newMessage.text &&
            Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000)
        );

        if (messageExists) {
          console.log('Duplicate message detected, ignoring:', newMessage);
          return prev;
        }

        const updated = [...prev, newMessage];
        sessionStorage.setItem(`chat_${postId}`, JSON.stringify(updated));
        return updated;
      });
    });

    // Listen for typing indicators
    socketRef.current.on('userTyping', ({ userId, username }) => {
      if (username !== currentUser.username) {
        setTypingUsers(prev => {
          if (!prev.includes(username)) {
            return [...prev, username];
          }
          return prev;
        });
      }
    });

    socketRef.current.on('userStoppedTyping', (userId) => {
      setTypingUsers(prev => prev.filter(u => u !== userId));
    });

    // Connection status
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Error handling
    socketRef.current.on('messageError', (error) => {
      console.error('Message error:', error);
      alert('Failed to send message: ' + error);
    });
  };

  const loadMessages = async (roomId) => {
    try {
      // Check session storage first
      const cached = sessionStorage.getItem(`chat_${roomId}`);
      if (cached) {
        setMessageData(JSON.parse(cached));
      }      // Fetch from server
      const response = await api.post('/messages1', {
        formData: roomId
      });

      if (Array.isArray(response.data)) {
        setMessageData(response.data);
        sessionStorage.setItem(`chat_${roomId}`, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageData]); const sendMessage = async () => {
    if (!user || inputValue.trim() === '' || !isConnected) {
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(), // Unique identifier
      sender: user.username,
      text: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      // Send through socket for real-time delivery and database storage
      socketRef.current.emit('sendMessage', {
        formData: postId,
        newMessage
      });

      // Clear input and stop typing
      setInputValue('');
      setIsTyping(false);
      socketRef.current.emit('stopTyping', { formData: postId });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    if (!isConnected) return;

    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        formData: postId,
        username: user.username
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketRef.current.emit('stopTyping', { formData: postId });
      }
    }, 2000);

    // Stop typing if input is empty
    if (!e.target.value.trim() && isTyping) {
      setIsTyping(false);
      socketRef.current.emit('stopTyping', { formData: postId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }; if (loading) {
    return (
      <div className="flex items-center justify-center text-gray-900 py-12 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 bg-gray-50 min-h-screen">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>            <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="Chat">💬</span>
            Chat with {chatPartner}
          </h1>
            {jobInfo && (
              <p className="text-sm text-gray-600">
                About: {jobInfo.title} • {jobInfo.category}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></div>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-96 overflow-y-auto p-4 mb-4">
          {messageData.length === 0 ? (<div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2" role="img" aria-label="Chat">💬</div>
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
          ) : (
            <div className="space-y-3">
              {messageData.map((msg, index) => {
                const isSender = msg.sender === user?.username;
                return (
                  <div
                    key={index}
                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${isSender
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                      <div className={`text-xs font-medium mb-1 ${isSender ? 'text-blue-100' : 'text-gray-600'}`}>
                        {msg.sender}
                      </div>
                      <p className="break-words">{msg.text}</p>
                      <div className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="text-gray-500 text-sm mb-2 px-4">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...</span>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default CHAT;