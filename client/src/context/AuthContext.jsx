import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('crm_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('crm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('crm_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setAdmin(res.data.admin);
            localStorage.setItem('crm_admin', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: jwtToken, admin: adminData } = res.data;
      localStorage.setItem('crm_token', jwtToken);
      localStorage.setItem('crm_admin', JSON.stringify(adminData));
      setToken(jwtToken);
      setAdmin(adminData);
      return adminData;
    }
  };

  const signup = async (name, email, password, avatar) => {
    const res = await api.post('/auth/register', { name, email, password, avatar });
    if (res.data.success) {
      const { token: jwtToken, admin: adminData } = res.data;
      localStorage.setItem('crm_token', jwtToken);
      localStorage.setItem('crm_admin', JSON.stringify(adminData));
      setToken(jwtToken);
      setAdmin(adminData);
      return adminData;
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_admin');
    setToken(null);
    setAdmin(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.success) {
      setAdmin(res.data.admin);
      localStorage.setItem('crm_admin', JSON.stringify(res.data.admin));
      return res.data.admin;
    }
  };

  const resetPassword = async (email, newPassword, confirmPassword) => {
    const res = await api.post('/auth/reset-password', {
      email,
      newPassword,
      confirmPassword,
    });
    if (res.data.success) {
      const { token: jwtToken, admin: adminData } = res.data;
      localStorage.setItem('crm_token', jwtToken);
      localStorage.setItem('crm_admin', JSON.stringify(adminData));
      setToken(jwtToken);
      setAdmin(adminData);
      return adminData;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
