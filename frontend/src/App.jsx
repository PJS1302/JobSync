import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import Drives from './pages/student/Drives';
import DriveDetails from './pages/student/DriveDetails';
import Applications from './pages/student/Applications';
import ApplicationDetails from './pages/student/ApplicationDetails';
import Placeholder from './pages/Placeholder';

/**
 * App Routing with Student Dashboard, Profile, Drives, and Applications
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="drives" element={<Drives />} />
          <Route path="drives/:id" element={<DriveDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
          <Route path="interviews" element={<Placeholder title="Interview Schedule" />} />
          <Route path="resume" element={<Placeholder title="AI Resume & Skills" />} />
          <Route path="notifications" element={<Placeholder title="Notifications & Alerts" />} />
          <Route path="*" element={<Placeholder title="Page Not Found (404)" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
