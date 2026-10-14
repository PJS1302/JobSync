import React, { useState, useRef, useEffect } from 'react';
import { getRelativeTime } from '../../utils/formatDate';

/**
 * NotificationBell component with dropdown drawer
 */
export default function NotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button
        id="btn-notification-bell"
        type="button"
        className="bell-btn"
        aria-label="View notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications & Alerts</h4>
            {unreadCount > 0 && onMarkAsRead && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onMarkAsRead('all')}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No notifications right now
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`notification-item ${!item.read ? 'unread' : ''}`}
                  onClick={() => {
                    if (!item.read && onMarkAsRead) onMarkAsRead(item.id);
                  }}
                >
                  <span
                    className="notification-indicator"
                    style={{
                      backgroundColor: item.priority === 'high' ? 'var(--danger)' : 'var(--accent-primary)',
                      opacity: item.read ? 0.3 : 1
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="notification-title">{item.title}</div>
                    <div className="notification-message">{item.message}</div>
                    <div className="notification-time">{getRelativeTime(item.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
