import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function PROFILE() {
  const [user, setUser] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalMessages: 0,
    activeJobs: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const initializeProfile = async () => {
      if (!isAuthenticated()) {
        alert('Please sign in to view your profile.');
        navigate('/signin');
        return;
      }

      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        // Fetch all jobs to filter user's jobs
        const jobsResponse = await api.get('/api/documents');
        const allJobs = jobsResponse.data;

        // Filter jobs posted by current user
        const userJobs = allJobs.filter(job => job.postedBy === currentUser.username);
        setMyJobs(userJobs);

        // Calculate stats
        const activeJobs = userJobs.filter(job => job.status === 'Open' || job.status === 'In Progress').length;

        // Get message counts for each job
        let totalMessages = 0;
        for (const job of userJobs) {
          try {
            const messagesResponse = await api.post('/getAllForPost', {
              postId: job._id
            });
            totalMessages += messagesResponse.data.reduce((sum, thread) => sum + thread.messages.length, 0);
          } catch (error) {
            console.error('Error fetching messages for job:', job._id, error);
          }
        }

        setStats({
          totalJobs: userJobs.length,
          totalMessages,
          activeJobs
        });

      } catch (error) {
        console.error('Error initializing profile:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center text-gray-900 py-12 bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center text-gray-900 py-12 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
          <Link
            to="/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.username}'s Profile
              </h1>
              <p className="text-gray-600">Manage your jobs and messages</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              to="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
              + New Job
            </Link>
            <Link
              to="/homepage"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Section */}        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-2" role="img" aria-label="Statistics">📊</div>
            <h3 className="text-xl font-semibold text-blue-600 mb-1">Total Jobs</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-2" role="img" aria-label="Messages">💬</div>
            <h3 className="text-xl font-semibold text-green-600 mb-1">Total Messages</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMessages}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-3xl mb-2" role="img" aria-label="Active">🔥</div>
            <h3 className="text-xl font-semibold text-orange-600 mb-1">Active Jobs</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">My Jobs</h2>          {myJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4" role="img" aria-label="Clipboard">📋</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">No jobs posted yet</h3>
              <p className="text-gray-500 mb-6">Start by posting your first job to connect with freelancers</p>
              <Link
                to="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJobs.map((job, index) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/messages/${job._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {job.category}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${job.status === 'Open' ? 'bg-green-100 text-green-700' :
                          job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {job.status}
                        </span>
                      </div>                  </div>
                    <div className="text-2xl group-hover:scale-110 transition-transform" role="img" aria-label="Job">
                      💼
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p><span className="font-medium">Created:</span> {new Date(job.createdAt).toLocaleDateString()}</p>
                    {job.deadline && (
                      <p><span className="font-medium">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                      View Messages →
                    </span>
                    <span className="text-gray-500">
                      Click to manage
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PROFILE;
