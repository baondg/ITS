import httpClient from './httpClient';

/**
 * Authentication Service following Single Responsibility Principle
 * Handles authentication-related API calls
 */
const authService = {
  login: (credentials) => {
    return httpClient.post('/auth/login', credentials);
  },

  register: (userData) => {
    return httpClient.post('/auth/register', userData);
  },

  getCurrentUser: () => {
    return httpClient.get('/auth/me');
  },

  checkEmailExists: (email) => {
    return httpClient.get(`/auth/check-email/${email}`);
  },

  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

export default authService;