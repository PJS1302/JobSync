import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * Route protection wrapper requiring authenticated session
 * and enforcing role permissions (student vs admin).
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="lg" text="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user directly to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If logged in as student attempting to access admin route, redirect to student dashboard
    if (user.role === 'student') {
      return <Navigate to="/dashboard" replace />;
    }
    // If logged in as admin attempting to access non-admin route, redirect to admin dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
}
