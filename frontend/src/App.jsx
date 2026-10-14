import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import StudentDashboard from './pages/student/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Student profile mock context
  const [student] = useState({
    id: 'std_22cs104',
    name: 'Alex Rivera',
    rollNumber: '22CS104',
    department: 'Computer Science & Engineering',
    graduationYear: 2027,
    cgpa: 8.72,
    backlogs: 0,
    profileCompleteness: 88
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_01',
      title: 'Interview Scheduled: QuantumFin Tech',
      message: 'Your Round 2 technical interview is confirmed for tomorrow at 10:00 AM via Google Meet.',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      priority: 'high',
      read: false
    },
    {
      id: 'notif_02',
      title: 'Eligibility Verified for CloudScale Dynamics',
      message: 'Your profile has met all department and GPA criteria for the Associate Software Engineer drive.',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      priority: 'normal',
      read: false
    },
    {
      id: 'notif_03',
      title: 'Placement Offer: Starlight Media Tech',
      message: 'Congratulations! Official placement offer letter has been published in your portal.',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      priority: 'high',
      read: true
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    if (id === 'all') {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } else {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        student={student}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          student={student}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main>
          {activeTab === 'dashboard' ? (
            <StudentDashboard />
          ) : (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div
                style={{
                  background: 'var(--bg-glass-card)',
                  padding: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  maxWidth: 520,
                  margin: '0 auto'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  This module is designated for team development and will be connected during its scheduled iteration.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
