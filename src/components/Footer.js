import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                FreelanceVerse
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connecting talented freelancers with amazing opportunities worldwide.
              Build your career, grow your business, and achieve your dreams.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986 6.618 0 11.986-5.368 11.986-11.986C24.003 5.367 18.635.001 12.017.001zM8.948 2.684c.976 0 1.767.79 1.767 1.767s-.79 1.767-1.767 1.767-1.767-.79-1.767-1.767.79-1.767 1.767-1.767zm7.104 0c.976 0 1.767.79 1.767 1.767s-.79 1.767-1.767 1.767-1.767-.79-1.767-1.767.79-1.767 1.767-1.767z" />
                </svg>
              </a>
            </div>
          </div>          {/* For Freelancers */}
          <div className="space-y-4">
            <h3 className="text-gray-800 font-semibold text-lg">For Freelancers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/world" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Find Work
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Join as Freelancer
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>          {/* For Clients */}
          <div className="space-y-4">
            <h3 className="text-gray-800 font-semibold text-lg">For Clients</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/upload" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/world" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Enterprise Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Customer Success
                </a>
              </li>
            </ul>
          </div>          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-gray-800 font-semibold text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Press & News
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Partnerships
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>        {/* Bottom Footer */}
        <div className="border-t border-gray-300 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-600 text-sm">
                © 2024 FreelanceVerse. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>for freelancers worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
