import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Load from localStorage on first render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((email, token) => {
    const userData = { email, token };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // persist
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user'); // clear storage
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = {
    user,
    token: user?.token || null,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
