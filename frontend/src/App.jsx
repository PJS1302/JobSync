import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Drives from './pages/student/Drives';
import DriveDetails from './pages/student/DriveDetails';
import Applications from './pages/student/Applications';
import ApplicationDetails from './pages/student/ApplicationDetails';
import Resume from './pages/student/Resume';
import Interviews from './pages/student/Interviews';
import Notifications from './pages/student/Notifications';

// Placement Officer (Admin) Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCompanies from './pages/admin/Companies';
import AdminDrives from './pages/admin/Drives';
import AdminApplicants from './pages/admin/Applicants';
import AdminInterviews from './pages/admin/Interviews';
import AdminAnalytics from './pages/admin/Analytics';

import Placeholder from './pages/Placeholder';

/**
 * Root Redirect Handler:
 * When the user enters the system (visiting '/'):
 * - If not authenticated: directly navigates to '/login'
 * - If authenticated: navigates to appropriate portal dashboard based on role
 */
function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader size="lg" text="Initializing JobSync..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

/**
 * App Routing with Authentication Provider and Role-based Protected Routes
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Path: First entry routes straight to Login if unauthenticated */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Application Routes wrapped with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Student Portal Routes */}
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="drives" element={<Drives />} />
            <Route path="drives/:id" element={<DriveDetails />} />
            <Route path="applications" element={<Applications />} />
            <Route path="applications/:id" element={<ApplicationDetails />} />
            <Route path="resume" element={<Resume />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="notifications" element={<Notifications />} />

            {/* Placement Officer (Admin) Portal Routes */}
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/companies"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminCompanies />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/drives"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDrives />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/applicants"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/interviews"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminInterviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/analytics"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Placeholder title="Page Not Found (404)" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
