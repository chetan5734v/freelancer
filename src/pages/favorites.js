import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function FAVORITES() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please sign in to view your favorites.');
      navigate('/signin');
      return;
    }

    fetchFavorites();
  }, [navigate]);

  const fetchFavorites = async () => {
    try {
      const user = getCurrentUser();
      const response = await api.post('/favorites', {
        username: user.username
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (jobId) => {
    try {
      const user = getCurrentUser();
      await api.post('/favorites/remove', {
        username: user.username,
        jobId
      });
      setFavorites(prev => prev.filter(fav => fav.jobId !== jobId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredFavorites = favorites.filter(fav =>
    category === 'all' || fav.category === category
  );

  const categories = [...new Set(favorites.map(fav => fav.category))];

  const handleJobClick = (jobId) => {
    navigate(`/messages/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">            <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="Favorites">⭐</span>
              <span>Favorite Jobs</span>
            </h1>
            <p className="text-gray-600 mt-2">Jobs you've saved for later</p>
          </div>
            <button
              onClick={() => navigate('/homepage')}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${category === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                All ({favorites.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {cat} ({favorites.filter(f => f.category === cat).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Grid */}        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4" role="img" aria-label="Star favorites">⭐</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No favorite jobs</h3>
            <p className="text-gray-500 mb-6">
              Start exploring jobs and save the ones you're interested in!
            </p>
            <button
              onClick={() => navigate('/world')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {job.title?.charAt(0)?.toUpperCase() || 'J'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Posted by <span className="font-medium">{job.postedBy}</span>
                          </p>
                        </div>
                      </div>
                    </div>                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(job.jobId);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Remove from favorites"
                    >
                      <span className="text-xl" role="img" aria-label="Remove favorite">❤️</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                      <p className="text-sm text-gray-900 mt-1">{job.category}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' :
                          job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {job.deadline && (
                    <div className="mb-4">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deadline</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    Saved on {new Date(job.savedAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleJobClick(job.jobId)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/chat/job_${job.jobId}_freelancer_${getCurrentUser().id}`)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Contact
                    </button>
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

export default FAVORITES;
