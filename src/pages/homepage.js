import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/api';

function HomePage() {
  const user = getCurrentUser();
  const username = user?.username || localStorage.getItem('username') || 'User';

  return (
    <div className="flex flex-col items-center justify-center text-gray-900 px-4 py-12 overflow-hidden relative bg-gray-50 min-h-screen">
      {/* Welcome Message */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg flex items-center justify-center gap-3">
          Welcome, {username}!
          <span className="text-5xl md:text-6xl" role="img" aria-label="Waving hand">👋</span>
        </h1>
        <p className="text-xl md:text-2xl mt-4 text-gray-600 max-w-xl mx-auto">
          Your professional freelancing platform for college projects
        </p>
      </div>

      {/* Key Points Section */}
      <div className="mb-12 w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">Why FreelanceVerse?</h2>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
            <span className="mr-3 text-blue-600 text-xl" role="img" aria-label="Education">🎓</span>
            <span>Built for <span className="font-semibold text-gray-900">college students</span> to get help with projects, assignments, and tasks.</span>
          </li>
          <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
            <span className="mr-3 text-green-600 text-xl" role="img" aria-label="Upload">📤</span>
            <span>Easily <span className="font-semibold text-gray-900">upload your college work</span> and connect with freelancers to complete it.</span>
          </li>
          <li className="flex items-start bg-white p-4 rounded-lg shadow-sm">
            <span className="mr-3 text-orange-600 text-xl" role="img" aria-label="Computer">💻</span>
            <span>Find talented peers to <span className="font-semibold text-gray-900">collaborate and finish your projects</span> on time.</span>
          </li>
        </ul>
      </div>

      {/* Options List */}
      <ul className="space-y-6 w-full max-w-md">
        <li>
          <Link
            to="/upload"
            className="block px-6 py-4 bg-white rounded-lg text-center text-lg font-semibold border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-gray-900 hover:text-blue-600"
          >
            Upload a Task
          </Link>
        </li>
        <li>
          <Link
            to="/world"
            className="block px-6 py-4 bg-white rounded-lg text-center text-lg font-semibold border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 text-gray-900 hover:text-green-600"
          >
            View All Jobs
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="block px-6 py-4 bg-white rounded-lg text-center text-lg font-semibold border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300 text-gray-900 hover:text-orange-600"
          >
            My Profile & Jobs
          </Link>
        </li>
        <li>
          <Link
            to="/favorites"
            className="block px-6 py-4 bg-white rounded-lg text-center text-lg font-semibold border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 text-gray-900 hover:text-purple-600 flex items-center justify-center gap-2"
          >
            <span className="text-lg" role="img" aria-label="Favorites">⭐</span>
            <span>My Favorites</span>
          </Link>
        </li>
        <li>
          <Link
            to="/notifications"
            className="block px-6 py-4 bg-white rounded-lg text-center text-lg font-semibold border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all duration-300 text-gray-900 hover:text-red-600 flex items-center justify-center gap-2"
          >
            <span className="text-lg" role="img" aria-label="Notifications">🔔</span>
            <span>Notifications</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;