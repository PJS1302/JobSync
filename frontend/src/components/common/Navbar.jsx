import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../../services/notificationService';

/**
 * Common Navbar component with live NotificationBell and portal indicator
 */
export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      // Ignore
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    const res = await markNotificationAsRead(id);
    if (res.success && res.data) {
      setNotifications(res.data);
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllNotificationsAsRead();
    if (res.success && res.data) {
      setNotifications(res.data);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link to={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-lg ${
            isAdmin
              ? 'bg-gradient-to-tr from-amber-600 to-indigo-600 shadow-amber-500/20'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/20'
          }`}>
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">JobSync</span>
        </Link>

        {isAdmin ? (
          <span className="hidden sm:inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Placement Officer Portal
          </span>
        ) : (
          <span className="hidden sm:inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Student Portal
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Portal Switcher button */}
        {isAdmin ? (
          <Link
            to="/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span>Student View</span>
            <span className="text-[10px] text-slate-400">↗</span>
          </Link>
        ) : (
          <Link
            to="/admin/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-all"
          >
            <span>Placement Officer</span>
            <span className="text-[10px] text-blue-400">→</span>
          </Link>
        )}

        {/* Notification Bell */}
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />

        {/* User avatar menu & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          {isAdmin ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-slate-800 shadow-sm">
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'PO'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">{user?.name || 'Placement Officer'}</div>
                <div className="text-[11px] text-slate-400">{user?.department || 'Placement Cell'}</div>
              </div>
            </div>
          ) : (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
              title="View Student Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-slate-800 shadow-sm">
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'ST'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">{user?.name || 'Student'}</div>
                <div className="text-[11px] text-slate-400">{user?.department || 'Computer Science'}</div>
              </div>
            </Link>
          )}

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-xs font-semibold flex items-center gap-1.5 ml-1"
            title="Sign out of JobSync"
            aria-label="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
