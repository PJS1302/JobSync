import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Placeholder from './pages/Placeholder';

/**
 * App Routing with Student Dashboard and Profile
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="drives" element={<Placeholder title="Placement Drives" />} />
          <Route path="applications" element={<Placeholder title="My Applications" />} />
          <Route path="interviews" element={<Placeholder title="Interview Schedule" />} />
          <Route path="resume" element={<Placeholder title="AI Resume & Skills" />} />
          <Route path="notifications" element={<Placeholder title="Notifications & Alerts" />} />
          <Route path="*" element={<Placeholder title="Page Not Found (404)" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
