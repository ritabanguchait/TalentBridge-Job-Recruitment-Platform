import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on page load
  useEffect(() => {
    const savedToken = localStorage.getItem('talentbridge_token');
    const savedUser = localStorage.getItem('talentbridge_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse cached user data', e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: jwt, ...userData } = response.data;

    setToken(jwt);
    setUser(userData);

    localStorage.setItem('talentbridge_token', jwt);
    localStorage.setItem('talentbridge_user', JSON.stringify(userData));

    return userData;
  };

  const register = async (registerData) => {
    const response = await api.post('/auth/register', registerData);
    const { token: jwt, ...userData } = response.data;

    setToken(jwt);
    setUser(userData);

    localStorage.setItem('talentbridge_token', jwt);
    localStorage.setItem('talentbridge_user', JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('talentbridge_token');
    localStorage.removeItem('talentbridge_user');
  };

  const value = {
    user,
    token,
    role: user?.role,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
