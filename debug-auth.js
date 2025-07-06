// Debug authentication in the browser console
// Run this in browser console to check authentication status

console.log('=== Authentication Debug ===');
console.log('Token:', sessionStorage.getItem('token'));
console.log('User:', sessionStorage.getItem('user'));
console.log('Username:', sessionStorage.getItem('username'));

// Check if user is authenticated
const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user');
  return !!(token && user);
};

console.log('Is Authenticated:', isAuthenticated());

// Get current user
const getCurrentUser = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

console.log('Current User:', getCurrentUser());
