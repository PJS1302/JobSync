import React from 'react';

const STATUS_MAP = {
  active: { label: 'Active', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  eligible: { label: 'Eligible', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  selected: { label: 'Selected', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  offered: { label: 'Offered', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  scheduled: { label: 'Scheduled', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', dot: 'bg-cyan-400' },
  applied: { label: 'Applied', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20', dot: 'bg-sky-400' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-400' },
  under_review: { label: 'Under Review', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  pending: { label: 'Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
  rejected: { label: 'Rejected', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-400' },
  ineligible: { label: 'Not Eligible', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-400' },
  published: { label: 'Published', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  closed: { label: 'Closed', bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', dot: 'bg-slate-400' }
};

/**
 * Common StatusBadge component using Tailwind CSS
 */
export default function StatusBadge({ status, label = null, className = '' }) {
  const normalizedKey = String(status || '').toLowerCase().replace(/[\s-]/g, '_');
  const config = STATUS_MAP[normalizedKey] || {
    label: status || 'Neutral',
    bg: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
    dot: 'bg-slate-400'
  };

  const displayLabel = label || config.label;
  const dotColor = config.dot || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${config.bg} ${className}`.trim()}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{displayLabel}</span>
    </span>
  );
}
