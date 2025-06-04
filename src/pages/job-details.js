import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function JOB_DETAILS() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please sign in to view job details.');
      navigate('/signin');
      return;
    }

    fetchJobDetails();
    fetchRelatedJobs();
    checkIfFavorite();
  }, [jobId, navigate]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get('/api/documents');
      const jobs = response.data;
      const foundJob = jobs.find(j => j._id === jobId);

      if (!foundJob) {
        alert('Job not found');
        navigate('/world');
        return;
      }

      setJob(foundJob);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedJobs = async () => {
    try {
      const response = await api.get('/api/documents');
      const jobs = response.data;
      const currentJob = jobs.find(j => j._id === jobId);

      if (currentJob) {
        // Find jobs in same category, excluding current job
        const related = jobs
          .filter(j => j._id !== jobId && j.category === currentJob.category && j.status === 'Open')
          .slice(0, 3);
        setRelatedJobs(related);
      }
    } catch (error) {
      console.error('Error fetching related jobs:', error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const user = getCurrentUser();
      const response = await api.post('/favorites', {
        username: user.username
      });
      const favorites = response.data;
      setIsFavorite(favorites.some(fav => fav.jobId === jobId));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const user = getCurrentUser();

      if (isFavorite) {
        await api.post('/favorites/remove', {
          username: user.username,
          jobId
        });
        setIsFavorite(false);
      } else {
        await api.post('/favorites/add', {
          username: user.username,
          jobId,
          title: job.title,
          category: job.category,
          postedBy: job.postedBy,
          status: job.status,
          deadline: job.deadline
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const updateJobStatus = async (newStatus) => {
    if (!job || !user || job.postedBy !== user.username) {
      return;
    }

    setUpdatingStatus(true);
    try {
      const response = await api.post('/jobs/update-status', {
        jobId: job._id,
        status: newStatus,
        postedBy: user.username
      });

      if (response.data.job) {
        setJob(response.data.job);
        alert(`Job status updated to "${newStatus}"`);
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Failed to update job status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleApply = async () => {
    const user = getCurrentUser();
    const roomId = `job_${jobId}_freelancer_${user.id}`;

    // Create notification for job owner
    try {
      await api.post('/notifications/create', {
        username: job.postedBy,
        title: 'New Job Application',
        message: `${user.username} is interested in your job "${job.title}"`,
        type: 'job_application',
        jobId: jobId,
        roomId: roomId
      });
    } catch (error) {
      console.error('Error creating application notification:', error);
    }

    navigate(`/chat/${roomId}`, {
      state: {
        jobData: job,
        isFreelancer: true,
        roomId
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/world')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const user = getCurrentUser();
  const isOwner = user && job.postedBy === user.username;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/world')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="mr-2">←</span>
              Back to Jobs
            </button>
            <div className="flex gap-3">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${isFavorite
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                  }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span className="text-xl" role="img" aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                  {isFavorite ? '❤️' : '🤍'}
                </span>
              </button>
              <button
                onClick={() => navigate('/homepage')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Job Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {job.title?.charAt(0)?.toUpperCase() || 'J'}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-lg text-gray-600">
                      Posted by <span className="font-semibold text-blue-600">{job.postedBy}</span>
                    </p>
                  </div>
                </div>                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="text-lg" role="img" aria-label="Date">📅</span>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  {job.deadline && (
                    <span className="flex items-center gap-2">
                      <span className="text-lg" role="img" aria-label="Deadline">⏰</span>
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${job.status === 'Open' ? 'bg-green-100 text-green-800' :
                  job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {job.status}
                </span>
              </div>
            </div>            {/* Job Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-lg" role="img" aria-label="Category">📂</span>
                  Category
                </h3>
                <p className="text-gray-700">{job.category}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-lg" role="img" aria-label="Status">📊</span>
                  Status
                </h3>
                <p className="text-gray-700">{job.status}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-lg" role="img" aria-label="Posted">🕒</span>
                  Posted
                </h3>
                <p className="text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && job.status === 'Open' && (
              <div className="flex gap-4">                <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg" role="img" aria-label="Chat">💬</span>
                Apply & Start Chat
              </button>
                <button
                  onClick={() => navigate(`/messages/${jobId}`)}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-lg" role="img" aria-label="Details">📋</span>
                  View Details
                </button>
              </div>
            )}            {isOwner && (
              <div className="space-y-4">                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-blue-600 text-xl" role="img" aria-label="Job Owner">👑</span>
                  <div>
                    <h3 className="font-semibold text-blue-900">You own this job</h3>
                    <p className="text-blue-700 text-sm">Manage applications and update job status</p>
                  </div>
                  <button
                    onClick={() => navigate(`/messages/${jobId}`)}
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Manage Job
                  </button>
                </div>
              </div>

                {/* Job Status Management */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-lg" role="img" aria-label="Settings">⚙️</span>
                    Job Status Management
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {['Open', 'In Progress', 'Completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateJobStatus(status)}
                        disabled={updatingStatus || job.status === status}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${job.status === status
                            ? 'bg-blue-600 text-white cursor-default'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                          }`}
                      >
                        {status === 'Open' && <span className="mr-2" role="img" aria-label="Open">🟢</span>}
                        {status === 'In Progress' && <span className="mr-2" role="img" aria-label="In Progress">🟡</span>}                        {status === 'Completed' && <span className="mr-2" role="img" aria-label="Completed">✅</span>}
                        {status}
                        {job.status === status && <span className="ml-2" role="img" aria-label="Current status">✓</span>}
                      </button>
                    ))}
                  </div>
                  {updatingStatus && (
                    <div className="mt-3 flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Updating status...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="p-8">            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="Job Information">📝</span>
            Job Information
          </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                This is a <strong>{job.category}</strong> project posted by <strong>{job.postedBy}</strong>.
                {job.deadline && (
                  <span> The deadline for this project is <strong>{new Date(job.deadline).toLocaleDateString()}</strong>.</span>
                )}
                {job.status === 'Open' && !isOwner && (
                  <span> This job is currently open for applications. Click "Apply & Start Chat" to get started!</span>
                )}
              </p>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <span className="text-lg" role="img" aria-label="How it works">💡</span>
                  How it works:
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Click "Apply & Start Chat" to express your interest</li>
                  <li>• Discuss project details directly with the job poster</li>
                  <li>• Negotiate terms and timeline through our chat system</li>
                  <li>• Complete the work and get paid!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Related Jobs">🔍</span>
              Related Jobs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((relatedJob) => (
                <div
                  key={relatedJob._id}
                  onClick={() => navigate(`/job/${relatedJob._id}`)}
                  className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {relatedJob.title?.charAt(0)?.toUpperCase() || 'J'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {relatedJob.title}
                      </h3>
                      <p className="text-sm text-gray-600">by {relatedJob.postedBy}</p>
                    </div>
                  </div>                  <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <span className="text-sm" role="img" aria-label="Category">📂</span>
                    <span>{relatedJob.category}</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Posted {new Date(relatedJob.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JOB_DETAILS;
