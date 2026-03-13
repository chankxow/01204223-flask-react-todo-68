// API Configuration for Firebase Deployment
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

// Determine API base URL based on environment
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'
  : (import.meta.env.VITE_API_BASE_URL || 'https://todo.onrender.com');

// Helper function for API calls
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
