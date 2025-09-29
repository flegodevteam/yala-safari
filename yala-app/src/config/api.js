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

  if (!token) {
    // Don't automatically redirect here, let the calling component handle it
    throw new Error("No authentication token found");
  }

  const config = {
    ...options,
    headers: {
      // Only set Content-Type if it's not FormData
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
      Authorization: `Bearer ${token}`, // Use Bearer token format
      "x-auth-token": token, // Keep the old format for backward compatibility
    },
  };

  const response = await fetch(url, config);

  // Only redirect to admin login if we're on a protected admin route
  if (response.status === 401) {
    const currentPath = window.location.pathname;
    const isAdminRoute =
      currentPath.startsWith("/dashboard") || currentPath.startsWith("/admin");

    if (isAdminRoute) {
      localStorage.removeItem("adminToken");
      // Let AuthGuard handle redirect instead of direct navigation
      throw new Error("Authentication required");
    }

    // For non-admin routes, just log the error but don't redirect
    console.warn("API request unauthorized, but on public route:", currentPath);
  }

  return response;
};

// Alternative: Create separate functions for public and admin API calls
export const publicFetch = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
    },
  };

  return await fetch(url, config);
};

// Use this for admin-only endpoints
export const adminFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const config = {
    ...options,
    headers: {
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
      ...(token && { "x-auth-token": token }),
    },
  };

  const response = await fetch(url, config);

  // Always redirect on 401 for admin endpoints
  if (response.status === 401) {
    // Remove invalid token
    localStorage.removeItem("adminToken");
    throw new Error("Authentication failed - please login again");
  }

  return response;
};

export default API_BASE_URL;
