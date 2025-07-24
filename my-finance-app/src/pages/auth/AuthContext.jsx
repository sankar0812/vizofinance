// import React, { createContext, useContext, useState, useCallback } from 'react'
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null)

//   const login = useCallback((email) => {
//     setUser({ email })
//   }, [])

//   const logout = useCallback(() => {
//     setUser(null);
//     navigate('/login', { replace: true });
//   }, [])

//   const value = { user, isAuthenticated: !!user, login, logout }
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider')
//   return ctx
// }


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

  const login = useCallback((email) => {
    const userData = { email };
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
