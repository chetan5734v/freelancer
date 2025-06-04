import React from 'react';
import { Link } from 'react-router-dom';

function HOME() {
    return (
        <div className="flex flex-col items-center justify-center text-white overflow-hidden px-4 py-12 min-h-screen relative">
            <div className="animate-fade-in-up text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg transition-all duration-700 ease-in-out">
                    Welcome to FreelanceVerse
                </h1>
                <p className="text-xl md:text-2xl mt-4 text-gray-600 max-w-xl mx-auto">
                    Find talent. Get tasks done. Freelance the smart way.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 w-full max-w-5xl px-4 md:px-0">
                <Link
                    to="/signin"
                    className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:scale-105 transition-all duration-500 hover:border-blue-500 hover:shadow-lg text-center group"
                >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Security">
                        🔐
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Sign In</h2>
                    <p className="text-gray-600 mb-6">
                        Already have an account? Welcome back! Sign in to continue your freelancing journey.
                    </p>
                    <div className="inline-flex items-center text-blue-600 font-semibold">
                        Sign In Now
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                </Link>

                <Link
                    to="/signup"
                    className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:scale-105 transition-all duration-500 hover:border-green-500 hover:shadow-lg text-center group"
                >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" role="img" aria-label="Sparkle">
                        ✨
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-green-600">Sign Up</h2>
                    <p className="text-gray-600 mb-6">
                        New to FreelanceVerse? Join thousands of students and freelancers today!
                    </p>
                    <div className="inline-flex items-center text-green-600 font-semibold">
                        Create Account
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                </Link>
            </div>

            {/* Features Section */}
            <div className="mt-16 w-full max-w-4xl text-center">
                <h3 className="text-2xl font-bold mb-8 text-gray-700">Why Choose FreelanceVerse?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="text-3xl mb-3" role="img" aria-label="Education">🎓</div>
                        <h4 className="font-semibold text-blue-600 mb-2">Student Focused</h4>
                        <p className="text-gray-600 text-sm">Built specifically for college students and academic projects</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="text-3xl mb-3" role="img" aria-label="Chat">💬</div>
                        <h4 className="font-semibold text-green-600 mb-2">Real-time Chat</h4>
                        <p className="text-gray-600 text-sm">Communicate instantly with freelancers and clients</p>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div className="text-3xl mb-3" role="img" aria-label="Speed">⚡</div>
                        <h4 className="font-semibold text-orange-600 mb-2">Fast & Easy</h4>
                        <p className="text-gray-600 text-sm">Quick project posting and seamless collaboration</p>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10rem] left-[-10rem] w-[25rem] h-[25rem] bg-pink-500 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-[-10rem] right-[-10rem] w-[25rem] h-[25rem] bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
            </div>
        </div>
    );
}

export default HOME;