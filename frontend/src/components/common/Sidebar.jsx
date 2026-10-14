import React from 'react';

/**
 * Sidebar Navigation Component for the Student Portal
 */
export default function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  isOpen = false,
  onClose,
  student
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    {
      id: 'drives',
      label: 'Placement Drives',
      badge: '3 New',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'interviews',
      label: 'Interview Schedule',
      badge: 'Upcoming',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      id: 'resume',
      label: 'AI Resume & Skills',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4" />
          <path d="m4.93 10.93 2.83-2.83" />
          <path d="M2 18h4" />
          <path d="M20 18h2" />
          <path d="m19.07 10.93-2.83-2.83" />
          <circle cx="12" cy="18" r="4" />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    }
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 45
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="nav-brand-logo" style={{ width: 32, height: 32 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>JobSync</span>
            </div>
            {isOpen && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onClose}
                aria-label="Close menu"
                style={{ padding: '0.2rem 0.5rem' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (onSelectTab) onSelectTab(item.id);
                  if (onClose) onClose();
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--accent-subtle)',
                      color: isActive ? '#fff' : 'var(--accent-indigo)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-student-card">
            <div className="sidebar-student-meta">
              <span>Profile Readiness</span>
              <strong style={{ color: '#38bdf8' }}>{student?.profileCompleteness || 85}%</strong>
            </div>
            <div className="sidebar-progress-bar">
              <div
                className="sidebar-progress-fill"
                style={{ width: `${student?.profileCompleteness || 85}%` }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>CGPA: <strong style={{ color: '#fff' }}>{student?.cgpa || '8.72'}</strong></span>
              <span>Backlogs: <strong style={{ color: '#10b981' }}>{student?.backlogs ?? 0}</strong></span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
