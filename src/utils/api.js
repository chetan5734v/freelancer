import axios from 'axios';

// Use environment variables for production hosting
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';

// For production, you'll set REACT_APP_API_URL to your Railway backend URL
console.log('API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasAuth: !!token,
      authHeader: config.headers.Authorization ? 'Bearer [token]' : 'None'
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  }, (error) => {
    // Only auto-redirect for specific cases to avoid conflicts with component-level error handling
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Check if this is a critical auth failure (no token or invalid token format)
      const token = sessionStorage.getItem('token');
      if (!token) {
        // No token at all - clear storage and redirect
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('username');
        window.location.href = '/signin';
      }
      // If there is a token, let the component handle the error
      // This allows for better error messaging and handling
    }

    // Handle network errors gracefully
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');
  return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Debug function to check authentication state
export const debugAuth = () => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');
  const username = sessionStorage.getItem('username');
  
  console.log('=== AUTH DEBUG ===');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'None');
  console.log('User data exists:', !!user);
  console.log('Username stored:', username);
  
  if (user) {
    try {
      const parsed = JSON.parse(user);
      console.log('Parsed user:', parsed);
    } catch (e) {
      console.log('Error parsing user data:', e);
    }
  }
  console.log('=== END AUTH DEBUG ===');
  
  return { token: !!token, user: !!user, username };
};

// Helper function to logout
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('username');
  window.location.href = '/signin';
};

export default api;
