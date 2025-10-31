// API Configuration
// Automatically detects environment and uses correct API URL
const getApiBaseUrl = () => {
  // 1. Check if environment variable is set
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('🔗 Using API_BASE_URL from .env:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }

  // 2. Auto-detect based on hostname
  const hostname = window.location.hostname;
  console.log('📍 Current hostname:', hostname);

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('💻 Running locally - Using http://localhost:5000');
    return 'http://localhost:5000';
  } else {
    console.log('🌐 Running in production - Using Vercel backend');
    return 'https://yala-safari-hspl.vercel.app';
  }
};

export const API_BASE_URL = getApiBaseUrl();

console.log('✅ Final API_BASE_URL:', API_BASE_URL);

// API endpoint builders
export const apiEndpoints = {
  // Admin endpoints
  admin: {
    login: `${API_BASE_URL}/api/admin/login`,
    packages: `${API_BASE_URL}/api/admin/packages`,
    bookings: `${API_BASE_URL}/api/bookings`,
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
  bookings: {
    create: `${API_BASE_URL}/api/bookings`,
    getAll: `${API_BASE_URL}/api/bookings`,
    getById: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    update: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    delete: (id) => `${API_BASE_URL}/api/bookings/${id}`,
    dateRange: (startDate, endDate) => 
      `${API_BASE_URL}/api/bookings/date-range?startDate=${startDate}&endDate=${endDate}`,
  },
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
  
  // System Settings
  settings: {
    bankDetails: `${API_BASE_URL}/api/settings/bank-details`,
    whatsapp: `${API_BASE_URL}/api/settings/whatsapp`,
  },

  packages: {
    base: `${API_BASE_URL}/api/packages`,
    current: `${API_BASE_URL}/api/packages/current`,
    byId: (id) => `${API_BASE_URL}/api/packages/${id}`,
    byPark: (park) => `${API_BASE_URL}/api/packages/park/${park}`,
    stats: `${API_BASE_URL}/api/packages/stats/overview`,
    toggleStatus: (id) => `${API_BASE_URL}/api/packages/${id}/toggle-status`,
  },
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
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
      ...(token && { "x-auth-token": token }),
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    const currentPath = window.location.pathname;
    const isAdminRoute = currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin');
    
    if (isAdminRoute) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin";
      throw new Error("Authentication required");
    }
    
    console.warn("API request unauthorized, but on public route:", currentPath);
  }

  return response;
};

// Public API calls (no authentication)
export const publicFetch = async (url, options = {}) => {
  console.log('🌐 Public API call to:', url);
  
  const config = {
    ...options,
    headers: {
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  console.log('📡 Response status:', response.status);
  
  return response;
};

// Admin API calls (with authentication)
export const adminFetch = async (url, options = {}) => {
  const token = getAuthToken();
  console.log('🔐 Admin API call to:', url);
  
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

  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
    throw new Error("Authentication required");
  }

  return response;
};

// Booking API Functions
export const bookingAPI = {
  // Create new booking
  create: async (bookingData) => {
    try {
      console.log('📝 Creating booking with data:', bookingData);
      const response = await publicFetch(apiEndpoints.bookings.create, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      console.log('✅ Booking created:', result);
      return result;
    } catch (error) {
      console.error('❌ Booking creation failed:', error);
      throw new Error(error.message || 'Failed to create booking');
    }
  },

  // Get all bookings (admin only)
  getAll: async () => {
    try {
      const response = await adminFetch(apiEndpoints.bookings.getAll);
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      const response = await publicFetch(apiEndpoints.bookings.getById(id));
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch booking');
    }
  },

  // Update booking (admin only)
  update: async (id, updateData) => {
    try {
      const response = await adminFetch(apiEndpoints.bookings.update(id), {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to update booking');
    }
  },

  // Delete booking (admin only)
  delete: async (id) => {
    try {
      const response = await adminFetch(apiEndpoints.bookings.delete(id), {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to delete booking');
    }
  },
};

export default API_BASE_URL;