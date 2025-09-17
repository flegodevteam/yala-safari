// API Configuration
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// API endpoint builders
export const apiEndpoints = {
  // Admin endpoints
  admin: {
    login: `${API_BASE_URL}/api/admin/login`,
    packages: `${API_BASE_URL}/api/admin/packages`,
  },

  // Package endpoints
  packages: {
    current: `${API_BASE_URL}/api/packages/current`,
    admin: `${API_BASE_URL}/api/admin/packages`,
    availability: (type, park) =>
      `${API_BASE_URL}/api/availability?type=${type}&park=${park}`,
  },

  // Blog endpoints
  blogs: {
    base: `${API_BASE_URL}/api/blogs`,
    byId: (id) => `${API_BASE_URL}/api/blogs/${id}`,
  },

  // Contact endpoints
  contact: `${API_BASE_URL}/api/contact`,

  // Booking endpoints
  booking: `${API_BASE_URL}/api/booking`,

  // Dashboard endpoints
  dashboard: {
    overview: `${API_BASE_URL}/api/dashboard/overview`,
  },

  // Image endpoints
  images: {
    base: `${API_BASE_URL}/api/images`,
    byId: (id) => `${API_BASE_URL}/api/images/${id}`,
    featured: (id) => `${API_BASE_URL}/api/images/${id}/featured`,
    url: (path) => `${API_BASE_URL}${path}`,
  },

  // Available dates endpoints
  availableDates: `${API_BASE_URL}/api/available-dates`,
};

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Helper function to create headers with auth token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { "x-auth-token": token }),
  };
};

// Helper function for authenticated API requests
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      // Only set Content-Type if it's not FormData
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
      ...(token && { "x-auth-token": token }),
    },
  };

  const response = await fetch(url, config);

  // If unauthorized, redirect to login
  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
    throw new Error("Authentication required");
  }

  return response;
};

export default API_BASE_URL;
