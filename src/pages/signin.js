// SIGNIN.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function SIGNIN() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/signin', formData);

      if (response.status === 200) {
        // Store both user data and JWT token in sessionStorage (tab-specific)
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('username', response.data.user.username);

        alert('Login successful!');
        navigate('/homepage');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-gray-900 overflow-hidden px-4 py-12 min-h-screen relative">
      <div className="animate-fade-in-up text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg transition-all duration-700 ease-in-out">
          Welcome Back!
        </h1>
        <p className="text-xl md:text-2xl mt-4 text-gray-600 max-w-xl mx-auto">
          Sign in to FreelanceVerse and continue your journey.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:scale-105 transition-all duration-500 hover:border-blue-500 hover:shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-300"
            >
              Sign up here
            </Link>
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SIGNIN;
