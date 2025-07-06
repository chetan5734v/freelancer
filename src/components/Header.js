import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from '../utils/api';
import { useNotifications } from '../context/NotificationContext';
import api from '../utils/api';

function Header() {
  const [user, setUser] = useState(null);
  const [userTokens, setUserTokens] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
      fetchUserTokens();
    }
  }, [location]);

  const fetchUserTokens = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await api.post('/tokens/balance', {
        username: currentUser.username
      });
      setUserTokens(response.data.tokens);
    } catch (error) {
      console.error('Error fetching user tokens:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  }; const isActive = (path) => location.pathname === path;
  // Determine if we're on a light background page
  const isLightBackground = ['/world', '/upload', '/profile', '/', '/signin', '/signup', '/homepage'].includes(location.pathname);

  return (
    <header className={`${isLightBackground ? 'bg-white border-gray-200' : 'bg-white/10 backdrop-blur-xl border-white/20'} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className={`text-2xl font-bold ${isLightBackground ? 'text-gray-900' : 'text-white'}`}>
                FreelanceVerse
              </span>
            </Link>
          </div>          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>                <Link
                to="/homepage"
                className={`${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/homepage') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                  }`}
              >
                Dashboard              </Link>
                <Link
                  to="/world"
                  className={`${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/world') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                    }`}
                >
                  Browse Jobs
                </Link>                <Link
                  to="/search"
                  className={`flex items-center gap-2 ${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/search') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                    }`}
                >
                  <span className="text-lg" role="img" aria-label="Search">🔍</span>
                  <span className="font-medium">Search</span>
                </Link>
                <Link
                  to="/upload"
                  className={`${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/upload') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                    }`}
                >
                  Post Job
                </Link>                <Link
                  to="/profile"
                  className={`${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/profile') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                    }`}
                >
                  My Profile
                </Link>                <Link
                  to="/favorites"
                  className={`flex items-center gap-2 ${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/favorites') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                    }`}
                >
                  <span className="text-lg" role="img" aria-label="Favorites">⭐</span>
                  <span className="font-medium">Favorites</span>
                </Link>

                {/* Token Display */}
                <Link
                  to="/tokens"
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${isLightBackground ? 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100' : 'border-white/30 bg-white/10 text-white hover:bg-white/20'} transition-colors`}
                >
                  <span className="text-lg" role="img" aria-label="Tokens">🪙</span>
                  <span className="font-medium">{userTokens}</span>
                </Link>

                <Link
                  to="/notifications"
                  className={`relative flex items-center gap-2 ${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/notifications') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                    }`}
                >
                  <span className="text-lg" role="img" aria-label="Notifications">🔔</span>
                  <span className="font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <>                <Link
                to="/world"
                className={`${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} transition-colors ${isActive('/world') ? (isLightBackground ? 'text-blue-600 font-semibold' : 'text-blue-400 font-semibold') : ''
                  }`}
              >
                Browse Jobs
              </Link>
                <span className={`${isLightBackground ? 'text-gray-500' : 'text-gray-400'}`}>How It Works</span>
                <span className={`${isLightBackground ? 'text-gray-500' : 'text-gray-400'}`}>About</span>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">                <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`${isLightBackground ? 'text-gray-900' : 'text-white'} font-medium`}>{user.username}</span>
              </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (<div className="flex items-center space-x-3">
              <Link
                to="/signin"
                className="text-white hover:text-gray-300 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Join Now
              </Link>
            </div>
            )}
          </div>          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${isLightBackground ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'} focus:outline-none`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2 border ${isLightBackground ? 'bg-white border-gray-200 shadow-lg' : 'bg-white/5 border-white/10'}`}>              {user ? (
              <>
                <Link
                  to="/homepage"
                  className={`block px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>                <Link
                  to="/world"
                  className={`block px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Jobs
                </Link>                <Link
                  to="/search"
                  className={`flex items-center gap-3 px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg" role="img" aria-label="Search">🔍</span>
                  <span className="font-medium">Search</span>
                </Link>
                <Link
                  to="/upload"
                  className={`block px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Job
                </Link>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>                <Link
                  to="/favorites"
                  className={`flex items-center gap-3 px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg" role="img" aria-label="Favorites">⭐</span>
                  <span className="font-medium">Favorites</span>
                </Link>
                <Link
                  to="/notifications"
                  className={`relative flex items-center gap-3 px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg" role="img" aria-label="Notifications">🔔</span>
                  <span className="font-medium">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <div className={`border-t ${isLightBackground ? 'border-gray-200' : 'border-white/20'} mt-2 pt-2`}>
                  <div className={`px-3 py-2 ${isLightBackground ? 'text-gray-600' : 'text-gray-300'}`}>
                    Welcome, {user.username}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-red-600 ${isLightBackground ? 'hover:bg-gray-100' : 'hover:bg-white/10'} rounded-md transition-colors`}
                  >
                    Logout
                  </button>
                </div>
              </>) : (
              <>
                <Link
                  to="/world"
                  className={`block px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                <div className={`border-t ${isLightBackground ? 'border-gray-200' : 'border-white/20'} mt-2 pt-2 space-y-2`}>
                  <Link
                    to="/signin"
                    className={`block px-3 py-2 ${isLightBackground ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'} rounded-md transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
