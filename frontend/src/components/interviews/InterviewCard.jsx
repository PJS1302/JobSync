import React from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';

/**
 * InterviewCard Component
 * Displays: Company, Role, Round, Date, Time, Mode, Location/Link, Status
 */
export default function InterviewCard({ interview }) {
  if (!interview) return null;

  const isOnline =
    interview.mode?.toLowerCase().includes('online') ||
    interview.locationOrLink?.startsWith('http');

  return (
    <div
      id={`interview-card-${interview.id}`}
      className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-md space-y-4"
    >
      {/* Header: Company, Role, Status */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white tracking-tight">{interview.company}</h3>
            <span className="text-xs text-slate-400 font-medium">({interview.role})</span>
          </div>
          <div className="text-sm font-semibold text-blue-400">{interview.round}</div>
        </div>
        <StatusBadge status={interview.status} />
      </div>

      {/* Grid of Details: Date, Time, Mode, Location/Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Date */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            Date
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>📅</span> {interview.date}
          </span>
        </div>

        {/* Time */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            Time
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>⏰</span> {interview.time}
          </span>
        </div>

        {/* Mode */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            Mode
          </span>
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <span>🌐</span> {interview.mode}
          </span>
        </div>

        {/* Location / Link */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            Location / Link
          </span>
          {isOnline ? (
            <a
              href={interview.locationOrLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1 truncate"
              title={interview.locationOrLink}
            >
              <span>🔗</span> Join Meeting Link
            </a>
          ) : (
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 truncate" title={interview.locationOrLink}>
              <span>📍</span> {interview.locationOrLink}
            </span>
          )}
        </div>
      </div>

      {/* Additional details / Instructions */}
      {interview.instructions && (
        <div className="p-3 rounded-xl bg-slate-800/30 text-xs text-slate-300 border border-slate-700/40 flex items-start gap-2">
          <span>ℹ️</span>
          <span>{interview.instructions}</span>
        </div>
      )}

      {/* Footer Action */}
      <div className="pt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Interviewer: <strong className="text-slate-300">{interview.interviewer || 'Placement Panel'}</strong>
        </span>
        {isOnline && interview.status === 'scheduled' && (
          <a href={interview.locationOrLink} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" size="sm">
              Launch Interview Meeting →
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
