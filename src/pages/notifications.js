import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function NOTIFICATIONS() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, jobs, messages
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please sign in to view notifications.');
      navigate('/signin');
      return;
    }

    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const user = getCurrentUser();
      const response = await api.post('/notifications', {
        username: user.username
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const user = getCurrentUser();
      await api.post('/notifications/clear-all', {
        username: user.username
      });
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'jobs') return notif.type === 'job';
    if (filter === 'messages') return notif.type === 'message';
    return true;
  });

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);

    // Navigate based on notification type
    if (notification.type === 'message') {
      navigate(`/chat/${notification.roomId}`);
    } else if (notification.type === 'job') {
      navigate(`/messages/${notification.jobId}`);
    } else if (notification.type === 'job_application') {
      navigate(`/messages/${notification.jobId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">            <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Notifications">🔔</span>
              <span>Notifications</span>
            </h1>
            <p className="text-gray-600 mt-2">Stay updated with your freelancing activity</p>
          </div>
            <div className="flex gap-4">
              <button
                onClick={clearAllNotifications}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => navigate('/homepage')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All', icon: '📋' },
            { key: 'unread', label: 'Unread', icon: '🔴' },
            { key: 'jobs', label: 'Jobs', icon: '💼' },
            { key: 'messages', label: 'Messages', icon: '💬' }
          ].map(tab => (<button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${filter === tab.key
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <span className="text-lg" role="img" aria-label={tab.label}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
          ))}
        </div>

        {/* Notifications List */}        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4" role="img" aria-label="No notifications">🔕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:shadow-md ${notification.read
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-blue-200 bg-blue-50 hover:border-blue-300'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">                    <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" role="img" aria-label={notification.type}>
                      {notification.type === 'message' ? '💬' :
                        notification.type === 'job' ? '💼' :
                          notification.type === 'job_application' ? '📋' : '🔔'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                      <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                      {!notification.read && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <span className="text-lg">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NOTIFICATIONS;
