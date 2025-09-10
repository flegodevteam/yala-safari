// API Configuration
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// API endpoint builders
export const apiEndpoints = {
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

export default API_BASE_URL;
