import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import api, { getCurrentUser, isAuthenticated } from '../utils/api';

function WORLD() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // ✅ create navigation instance

    useEffect(() => {
        if (isAuthenticated()) {
            const currentUser = getCurrentUser();
            setUser(currentUser || { username: 'User' });
        } else {
            // Set user to null for unauthenticated users - this is expected
            setUser(null);
        }
    }, []);

    useEffect(() => {
        // Fetch jobs using the authenticated API
        api.get('/api/documents')
            .then(response => {
                const currentUser = getCurrentUser();
                // Filter out jobs posted by current user to avoid seeing own jobs (only if authenticated)
                const filteredJobs = currentUser && isAuthenticated()
                    ? response.data.filter(job => job.postedBy !== currentUser.username)
                    : response.data;
                setJobs(filteredJobs);
                setFilteredJobs(filteredJobs);
            })
            .catch(err => console.error('Error fetching jobs:', err));

        const socket = io('http://localhost:8002');
        socket.on('newJob', (job) => {
            setJobs(prevJobs => [job, ...prevJobs]);
            setFilteredJobs(prevJobs => [job, ...prevJobs]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Filter and sort jobs whenever filters change
    useEffect(() => {
        let filtered = [...jobs];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.postedBy.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(job => job.category === selectedCategory);
        }

        // Status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(job => job.status === selectedStatus);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'deadline':
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline) - new Date(b.deadline);
                default:
                    return 0;
            }
        });

        setFilteredJobs(filtered);
    }, [jobs, selectedCategory, selectedStatus, sortBy, searchQuery]);

    // Get unique categories from jobs
    const categories = [...new Set(jobs.map(job => job.category))];
    const statuses = ['Open', 'In Progress', 'Completed'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isAuthenticated() && user ? `Welcome back, ${user.username}!` : 'Browse Jobs'}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {isAuthenticated() && user ? 'Find your next freelance opportunity' : 'Discover amazing freelance opportunities'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {filteredJobs.length} of {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search jobs, categories, or users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Filter by:</span>
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                            >
                                <option value="all">All Status</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Sort Filter */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="title">Title A-Z</option>
                                <option value="deadline">By Deadline</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(selectedCategory !== 'all' || selectedStatus !== 'all' || sortBy !== 'recent' || searchQuery.trim()) && (
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSelectedStatus('all');
                                    setSortBy('recent');
                                    setSearchQuery('');
                                }}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {jobs.length === 0 ? 'No jobs available' : 'No jobs match your filters'}
                            </h3>
                            <p className="text-gray-500">
                                {jobs.length === 0 ? 'Be the first to post a job opportunity!' : 'Try adjusting your filters to see more jobs.'}
                            </p>
                            {jobs.length > 0 && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSelectedStatus('all');
                                        setSortBy('recent');
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredJobs.map((job, idx) => (
                            <div
                                key={job._id || idx}
                                onClick={() => {
                                    if (isAuthenticated()) {
                                        navigate(`/messages/${job._id}`);
                                    } else {
                                        alert('Please sign in to contact freelancers and view job details.');
                                        navigate('/signin');
                                    }
                                }}
                                className="cursor-pointer bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-lg">
                                                    {job.title?.charAt(0)?.toUpperCase() || 'J'}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Posted by <span className="font-medium">{job.postedBy}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</span>
                                                <p className="text-sm text-gray-900 mt-1">{job.category}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                                                <div className="mt-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' :
                                                        job.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            job.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deadline</span>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Posted</span>
                                                <p className="text-sm text-gray-900 mt-1">
                                                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-6 flex flex-col items-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/job/${job._id}`);
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                            {isAuthenticated() ? 'Apply Now' : 'Sign in to Apply'}
                                        </button>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Click to view details
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default WORLD;
