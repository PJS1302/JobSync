import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';

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
 * App Routing with Student Portal and Placement Officer Admin Portal
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Student Portal Routes */}
          <Route index element={<StudentDashboard />} />
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
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="companies" element={<AdminCompanies />} />
            <Route path="drives" element={<AdminDrives />} />
            <Route path="applicants" element={<AdminApplicants />} />
            <Route path="interviews" element={<AdminInterviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          <Route path="*" element={<Placeholder title="Page Not Found (404)" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
