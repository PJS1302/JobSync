import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

/**
 * Route protection wrapper requiring authenticated session
 * and enforcing role permissions (student vs admin).
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
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
    // When attempting to access another role's portal, prompt for login with that role
    logout();
    return (
      <Navigate
        to={`/login?role=${allowedRole}`}
        state={{
          from: location,
          role: allowedRole,
          notice: `Please log in with ${allowedRole === 'admin' ? 'Placement Officer' : 'Student'} credentials to access this portal.`
        }}
        replace
      />
    );
  }

  return children;
}
