import React from 'react';
import NotificationItem from './NotificationItem';

/**
 * NotificationList Component
 * Renders filtered list of notification items or empty state
 */
export default function NotificationList({ notifications = [], onMarkRead }) {
  if (notifications.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
        <div className="text-3xl mb-2">📭</div>
        <h3 className="text-base font-bold text-white">No Notifications</h3>
        <p className="text-xs text-slate-400 mt-1">
          You are all caught up! New placement alerts and round updates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((item) => (
        <NotificationItem
          key={item.id}
          notification={item}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}
