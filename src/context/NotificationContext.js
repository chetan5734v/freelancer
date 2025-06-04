import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getCurrentUser, isAuthenticated } from '../utils/api';
import api from '../utils/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return safe defaults when used outside provider (e.g., for server-side rendering)
    return {
      notifications: [],
      unreadCount: 0,
      markAsRead: () => { },
      clearAll: () => { },
      createNotification: () => { },
      fetchNotifications: () => { }
    };
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) return;

    // Initialize socket connection for real-time notifications
    const socketConnection = io('http://localhost:8002', {
      transports: ['websocket', 'polling']
    });

    setSocket(socketConnection);    // Listen for real-time notifications
    socketConnection.on('newNotification', (notification) => {
      const currentUser = getCurrentUser();

      // Only process notifications intended for the current user
      if (currentUser && notification.username === currentUser.username) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      }
    });

    // Load existing notifications
    fetchNotifications();

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = getCurrentUser();
      const response = await api.post('/notifications', {
        username: user.username
      });
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.post('/notifications/mark-read', {
        notificationId
      });

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      const user = getCurrentUser();
      await api.post('/notifications/clear-all', {
        username: user.username
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const createNotification = async (title, message, type, jobId = null, roomId = null) => {
    try {
      const user = getCurrentUser();

      // Emit to server for real-time delivery
      if (socket) {
        socket.emit('createNotification', {
          username: user.username,
          title,
          message,
          type,
          jobId,
          roomId
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    createNotification,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
