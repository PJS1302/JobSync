import React from 'react';
import { Link } from 'react-router-dom';
import { NOTIFICATION_TYPES } from '../../services/notificationService';

/**
 * NotificationDropdown Component
 * Popover drawer displaying recent unread alerts with mark-read actions
 */
export default function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  onClose
}) {
  return (
    <div
      id="notification-dropdown-menu"
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-fadeIn"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {unreadCount > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No notifications available
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => {
            const typeConfig = NOTIFICATION_TYPES[notif.type] || {
              icon: '🔔',
              label: notif.type
            };

            return (
              <div
                key={notif.id}
                className={`p-3 rounded-xl transition-colors cursor-pointer ${
                  !notif.read ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'hover:bg-slate-800/40'
                }`}
                onClick={() => {
                  if (!notif.read && onMarkRead) onMarkRead(notif.id);
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs">{typeConfig.icon}</span>
                    <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                  </div>
                  {!notif.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">{notif.message}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">{notif.timestamp}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs text-blue-400 hover:text-blue-300 font-bold block"
        >
          View All Notifications →
        </Link>
      </div>
    </div>
  );
}
