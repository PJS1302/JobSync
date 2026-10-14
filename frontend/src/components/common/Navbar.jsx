import React from 'react';
import NotificationBell from './NotificationBell';

/**
 * Top Navbar component for the Student Portal
 */
export default function Navbar({
  student,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onToggleSidebar
}) {
  const initials = student?.name
    ? student.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'JS';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          id="btn-mobile-sidebar-toggle"
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <a href="#dashboard" className="nav-brand">
          <div className="nav-brand-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
          </div>
          <span className="nav-brand-title">JobSync</span>
        </a>

        <span className="nav-portal-badge">Student Portal</span>
      </div>

      <div className="navbar-right">
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={onMarkAsRead}
        />

        <div className="user-profile-menu" title={`Logged in as ${student?.name || 'Student'}`}>
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <span className="user-name">{student?.name || 'Student Candidate'}</span>
            <span className="user-dept">{student?.department || 'Computer Science'} • {student?.rollNumber || '22CS104'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
