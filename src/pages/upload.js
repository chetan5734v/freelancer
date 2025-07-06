import React, { useState, useEffect } from 'react';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function UploadTask() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    title: '',
    category: '',
    postedBy: currentUser?.username || '',
    status: 'Open',
    deadline: '',
    createdAt: new Date().toISOString().slice(0, 16), // default to now
  });
  const [message, setMessage] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please sign in to upload tasks');
      navigate('/signin');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!isAuthenticated()) {
      alert('Please sign in to upload tasks');
      navigate('/signin');
      return;
    }

    try {
      const response = await api.post('/task', form);

      if (response.status === 200) {
        setMessage('Task uploaded successfully! 1 token deducted.');
        setForm({
          title: '',
          category: '',
          postedBy: currentUser?.username || '',
          status: 'Open',
          deadline: '',
          createdAt: new Date().toISOString().slice(0, 16),
        });

        // Navigate to homepage after successful upload
        setTimeout(() => {
          navigate('/homepage');
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);

      if (error.response?.status === 402) {
        // Insufficient tokens
        const shouldBuyTokens = window.confirm(
          `${error.response.data.message}\n\nWould you like to purchase tokens now?`
        );

        if (shouldBuyTokens) {
          navigate('/tokens');
        }
      } else {
        setMessage(error.response?.data?.message || 'Failed to upload task');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-600 mt-2">
              Share your project details and connect with talented freelancers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Build a React Website"
                />
              </div>

              {/* Category Field */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select a category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Design">Design</option>
                  <option value="Writing">Writing</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Deadline Field */}
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Posted By Field (Read-only) */}
              <div>
                <label htmlFor="postedBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Posted By
                </label>
                <input
                  type="text"
                  id="postedBy"
                  name="postedBy"
                  value={form.postedBy}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Post Job
                </button>
              </div>
            </form>

            {/* Success/Error Messages */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg ${message.includes('successfully') || message.includes('Success')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadTask;