import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        try {
          await authAPI.getProfile();
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (phone, password) => {
    try {
      const response = await authAPI.login({ phone, password });
      
      if (response.success) {
        const { user: userData, token: userToken } = response.data;
        
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(userToken);
        setUser(userData);
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { user: newUser, token: userToken } = response.data;
        
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(userToken);
        setUser(newUser);
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };


  const requestPasswordReset = async (phone) => {
    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      if (response.ok) {
        return { success: true, message: 'Reset code sent to your phone' };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Failed to send reset code' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // New: Verify Reset Code
  const verifyResetCode = async (phone, code) => {
    try {
      const response = await fetch('/api/auth/password-reset/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      
      if (response.ok) {
        return { success: true, message: 'Code verified successfully' };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Invalid reset code' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // New: Reset Password
  const resetPassword = async (phone, code, newPassword) => {
    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, newPassword }),
      });
      
      if (response.ok) {
        return { success: true, message: 'Password reset successful' };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Password reset failed' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };


  const logout = () => {
    authAPI.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};