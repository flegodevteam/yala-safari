// frontend/src/utils/auth.js

/**
 * Logout user - clears all auth data and redirects to login
 */
export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
  window.location.href = '/login';
};

/**
 * Get admin information from localStorage
 * @returns {Object|null} Admin info object or null
 */
export const getAdminInfo = () => {
  try {
    const info = localStorage.getItem('adminInfo');
    return info ? JSON.parse(info) : null;
  } catch (error) {
    console.error('Error parsing admin info:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

/**
 * Get authentication token
 * @returns {string|null} Token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

/**
 * Set admin info in localStorage
 * @param {Object} adminInfo - Admin information object
 */
export const setAdminInfo = (adminInfo) => {
  try {
    localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
  } catch (error) {
    console.error('Error saving admin info:', error);
  }
};

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  localStorage.setItem('adminToken', token);
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminInfo');
};