import React, { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)

  const login = useCallback((email) => {
    setUser({ email })
  }, [])

  const logout = useCallback(() => {
    setUser(null);
    navigate('/login', { replace: true });
  }, [])

  const value = { user, isAuthenticated: !!user, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}