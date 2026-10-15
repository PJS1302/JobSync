import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getSavedSession } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on app boot
    const session = getSavedSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password, role }) => {
    const res = await apiLogin({ email, password, role });
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await apiRegister(userData);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setToken(null);
  };

  const switchRole = (newRole) => {
    if (user) {
      const updatedUser = {
        ...user,
        role: newRole,
      };
      setUser(updatedUser);
      localStorage.setItem('jobsync_auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
