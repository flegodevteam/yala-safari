// API Configuration
// Automatically detects environment and uses correct API URL
const getApiBaseUrl = () => {
  // 1. Check if environment variable is set (PRIORITY)
  if (process.env.REACT_APP_API_BASE_URL) {
    console.log('🔗 Using API_BASE_URL from .env:', process.env.REACT_APP_API_BASE_URL);
    return process.env.REACT_APP_API_BASE_URL;
  }

  // 2. Auto-detect based on hostname
  const hostname = window.location.hostname;
  console.log('📍 Current hostname:', hostname);

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('💻 Running locally - Using https://squid-app-qwyej.ondigitalocean.app');
    return 'https://squid-app-qwyej.ondigitalocean.app';
  } else {
    // ✅ PRODUCTION URL - Replace with your actual DigitalOcean URL
    const productionUrl = 'https://squid-app-qwyej.ondigitalocean.app';
    console.log('🌐 Running in production - Using:', productionUrl);
    return productionUrl;
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
    base: `${API_BASE_URL}/api/packages`,
    current: `${API_BASE_URL}/api/packages/current`,
    byId: (id) => `${API_BASE_URL}/api/packages/${id}`,
    byPark: (park) => `${API_BASE_URL}/api/packages/park/${park}`,
    stats: `${API_BASE_URL}/api/packages/stats/overview`,
    toggleStatus: (id) => `${API_BASE_URL}/api/packages/${id}/toggle-status`,
    admin: `${API_BASE_URL}/api/admin/packages`,
    availability: (type, park) =>
      `${API_BASE_URL}/api/availability?type=${type}&park=${park}`,
    
    // 🆕 PRICING MANAGEMENT ENDPOINTS
    pricing: {
      // Update jeep pricing
      jeep: (id) => `${API_BASE_URL}/api/packages/${id}/jeep-pricing`,
      // Update guide pricing
      guide: (id) => `${API_BASE_URL}/api/packages/${id}/guide-pricing`,
      // Meal options management
      mealOptions: {
        add: (id) => `${API_BASE_URL}/api/packages/${id}/meal-options`,
        update: (id, mealType, itemIndex) => 
          `${API_BASE_URL}/api/packages/${id}/meal-options/${mealType}/${itemIndex}`,
        delete: (id, mealType, itemIndex) => 
          `${API_BASE_URL}/api/packages/${id}/meal-options/${mealType}/${itemIndex}`,
      },
      // Bulk update all pricing
      bulk: (id) => `${API_BASE_URL}/api/packages/${id}/pricing-bulk`,
    },
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
  // Rooms endpoints
  rooms: {
    base: `${API_BASE_URL}/api/rooms`,
    byId: (id) => `${API_BASE_URL}/api/rooms/${id}`,
  },
  // Taxis endpoints
  taxis: {
    base: `${API_BASE_URL}/api/taxis`,
    byId: (id) => `${API_BASE_URL}/api/taxis/${id}`,
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

// 🆕 PACKAGE PRICING API FUNCTIONS
export const packagePricingAPI = {
  // Update jeep pricing for specific type and time slot
  updateJeepPricing: async (packageId, jeepType, timeSlot, price) => {
    try {
      console.log(`🚙 Updating ${jeepType} jeep ${timeSlot} price to $${price}`);
      const response = await adminFetch(apiEndpoints.packages.pricing.jeep(packageId), {
        method: 'PUT',
        body: JSON.stringify({ jeepType, timeSlot, price }),
      });
      const result = await response.json();
      console.log('✅ Jeep pricing updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to update jeep pricing:', error);
      throw error;
    }
  },

  // Update guide pricing for specific guide type
  updateGuidePricing: async (packageId, guideType, price) => {
    try {
      console.log(`👨‍✈️ Updating ${guideType} price to $${price}`);
      const response = await adminFetch(apiEndpoints.packages.pricing.guide(packageId), {
        method: 'PUT',
        body: JSON.stringify({ guideType, price }),
      });
      const result = await response.json();
      console.log('✅ Guide pricing updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to update guide pricing:', error);
      throw error;
    }
  },

  // Add new meal option
  addMealOption: async (packageId, mealType, mealItem) => {
    try {
      console.log(`🍽️ Adding ${mealType} item:`, mealItem);
      const response = await adminFetch(apiEndpoints.packages.pricing.mealOptions.add(packageId), {
        method: 'POST',
        body: JSON.stringify({ mealType, ...mealItem }),
      });
      const result = await response.json();
      console.log('✅ Meal option added:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to add meal option:', error);
      throw error;
    }
  },

  // Update existing meal option
  updateMealOption: async (packageId, mealType, itemIndex, updates) => {
    try {
      console.log(`🍽️ Updating ${mealType} item ${itemIndex}:`, updates);
      const response = await adminFetch(
        apiEndpoints.packages.pricing.mealOptions.update(packageId, mealType, itemIndex),
        {
          method: 'PUT',
          body: JSON.stringify(updates),
        }
      );
      const result = await response.json();
      console.log('✅ Meal option updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to update meal option:', error);
      throw error;
    }
  },

  // Delete meal option
  deleteMealOption: async (packageId, mealType, itemIndex) => {
    try {
      console.log(`🗑️ Deleting ${mealType} item ${itemIndex}`);
      const response = await adminFetch(
        apiEndpoints.packages.pricing.mealOptions.delete(packageId, mealType, itemIndex),
        {
          method: 'DELETE',
        }
      );
      const result = await response.json();
      console.log('✅ Meal option deleted:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to delete meal option:', error);
      throw error;
    }
  },

  // Bulk update all pricing at once
  bulkUpdatePricing: async (packageId, pricingData) => {
    try {
      console.log('📦 Bulk updating pricing for package:', packageId);
      const response = await adminFetch(apiEndpoints.packages.pricing.bulk(packageId), {
        method: 'PUT',
        body: JSON.stringify(pricingData),
      });
      const result = await response.json();
      console.log('✅ Bulk pricing updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to bulk update pricing:', error);
      throw error;
    }
  },
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

// 🆕 PACKAGE API FUNCTIONS (for convenience)
export const packageAPI = {
  // Get all packages
  getAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams 
        ? `${apiEndpoints.packages.base}?${queryParams}`
        : apiEndpoints.packages.base;
      
      const response = await publicFetch(url);
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch packages');
    }
  },

  // Get package by ID
  getById: async (id) => {
    try {
      const response = await publicFetch(apiEndpoints.packages.byId(id));
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch package');
    }
  },

  // Create package (admin only)
  create: async (packageData) => {
    try {
      console.log('📦 Creating package:', packageData);
      const response = await adminFetch(apiEndpoints.packages.base, {
        method: 'POST',
        body: JSON.stringify(packageData),
      });
      const result = await response.json();
      console.log('✅ Package created:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to create package:', error);
      throw error;
    }
  },

  // Update package (admin only)
  update: async (id, packageData) => {
    try {
      console.log('📦 Updating package:', id);
      const response = await adminFetch(apiEndpoints.packages.byId(id), {
        method: 'PUT',
        body: JSON.stringify(packageData),
      });
      const result = await response.json();
      console.log('✅ Package updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to update package:', error);
      throw error;
    }
  },

  // Delete package (admin only)
  delete: async (id) => {
    try {
      console.log('🗑️ Deleting package:', id);
      const response = await adminFetch(apiEndpoints.packages.byId(id), {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log('✅ Package deleted:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to delete package:', error);
      throw error;
    }
  },

  // Toggle package status (admin only)
  toggleStatus: async (id) => {
    try {
      console.log('🔄 Toggling package status:', id);
      const response = await adminFetch(apiEndpoints.packages.toggleStatus(id), {
        method: 'PATCH',
      });
      const result = await response.json();
      console.log('✅ Package status toggled:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to toggle package status:', error);
      throw error;
    }
  },

  // Get package statistics (admin only)
  getStats: async () => {
    try {
      const response = await adminFetch(apiEndpoints.packages.stats);
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch package stats');
    }
  },
};

export default API_BASE_URL;