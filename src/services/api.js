import axios from 'axios';

const API_BASE_URL = 'https://superradical-alverta-unswung.ngrok-free.dev/api';

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
    } else if (error.response?.status === 403) {
      console.error('Access denied - insufficient permissions');
      // You can redirect to appropriate dashboard or show access denied message
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
export const mpesaAPI = {
  stkPush: async (paymentData) => {
    const response = await api.post('/mpesa/stk-push', paymentData);
    return response.data;
  }
};

// Member API
export const memberAPI = {
  getProfile: async () => {
    const response = await api.get('/members/profile');
    return response.data;
  },

  getContributions: async () => {
    const response = await api.get('/members/contributions');
    return response.data;
  },

  getChamaMembers: async () => {
    const response = await api.get('/members/chama-members');
    return response.data;
  },

  getChamaSummary: async () => {
    const response = await api.get('/members/chama-summary');
    return response.data;
  },
};

// Chama Admin API
export const chamaAdminAPI = {
  getDashboard: async () => {
    const response = await api.get('/chama-admin/dashboard');
    return response.data;
  },

  getContributions: async (chamaId) => {
    const response = await api.get(`/chama-admin/contributions/${chamaId}`);
    return response.data;
  },

  getReports: async (chamaId) => {
    const response = await api.get(`/chama-admin/reports/${chamaId}`);
    return response.data;
  },

  addMember: async (chamaId, memberData) => {
    const response = await api.post(`/chama-admin/${chamaId}/members`, memberData);
    return response.data;
  },

  removeMember: async (chamaId, memberId) => {
    const response = await api.delete(`/chama-admin/${chamaId}/members/${memberId}`);
    return response.data;
  },
};

// Super Admin API
export const superAdminAPI = {
  getOverview: async () => {
    const response = await api.get('/super-admin/overview');
    return response.data;
  },

  getChamaGroups: async () => {
    const response = await api.get('/test/chama-groups');
    return response.data;
  },

  createChamaGroup: async (groupData) => {
    const response = await api.post('/super-admin/chama-groups', groupData);
    return response.data;
  },

  updateChamaGroup: async (chamaId, groupData) => {
    const response = await api.put(`/super-admin/chama-groups/${chamaId}`, groupData);
    return response.data;
  },

  deleteChamaGroup: async (chamaId) => {
    const response = await api.delete(`/super-admin/chama-groups/${chamaId}`);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/super-admin/users');
    return response.data;
  },

  updateUserRole: async (userId, roleData) => {
    const response = await api.put(`/super-admin/users/${userId}/role`, roleData);
    return response.data;
  },

  resetUserPassword: async (userId, passwordData) => {
    const response = await api.post(`/super-admin/users/${userId}/reset-password`, passwordData);
    return response.data;
  },
};

// Dashboard API (legacy - will be replaced by role-specific APIs)
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

// Admin API (legacy - will be replaced by role-specific APIs)
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