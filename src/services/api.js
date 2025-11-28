import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// M-Pesa API
// M-Pesa API
export const mpesaAPI = {
  stkPush: async (paymentData) => {
    try {
      const response = await api.post('/mpesa/stk-push', paymentData);
      return response.data;
    } catch (error) {
      console.error('M-Pesa STK Push Error:', error);
      throw error;
    }
  }
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  getTransactions: async (page = 1, limit = 10) => {
    const response = await api.get(`/dashboard/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMonthlySummary: async (year = new Date().getFullYear()) => {
    const response = await api.get(`/dashboard/monthly-summary?year=${year}`);
    return response.data;
  }
};

// Transactions API
export const transactionsAPI = {
  getMyTransactions: async () => {
    const response = await api.get('/transactions/my-transactions');
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  getTransactionByReceipt: async (receipt) => {
    const response = await api.get(`/transactions/receipt/${receipt}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await api.post('/admin/create-admin', adminData);
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  const response = await axios.get('http://localhost:3000/');
  return response.data;
};

export default api;