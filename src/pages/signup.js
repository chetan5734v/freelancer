import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SIGNUP() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
            const response = await axios.post('http://localhost:8002/signup', formData);

            if (response.status === 201) {
                // Store both user data and JWT token in sessionStorage (tab-specific)
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('username', response.data.user.username);

                alert('Signup successful! Welcome to FreelanceVerse!');
                navigate('/homepage'); // Redirect directly to homepage after successful signup
            } else {
                alert(response.data.message || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-gray-900 overflow-hidden px-4 py-12 relative">
            <div className="animate-fade-in-up text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg transition-all duration-700 ease-in-out">
                    Join FreelanceVerse!
                </h1>
                <p className="text-xl md:text-2xl mt-4 text-gray-600 max-w-xl mx-auto">
                    Create your account and start your freelancing journey.
                </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:scale-105 transition-all duration-500 hover:border-green-500 hover:shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-green-600 text-center">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fn" className="block text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="fn"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                placeholder="First name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="ln" className="block text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="ln"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                placeholder="Last name"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="un" className="block text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="un"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="pas" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="pas"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                            placeholder="Choose a password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/50"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/signin"
                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                        >
                            Sign in here
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

export default SIGNUP;