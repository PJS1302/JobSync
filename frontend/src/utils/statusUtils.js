/**
 * Status formatting and visual mapping utilities for JobSync
 */

export const STATUS_CONFIG = {
  // Application statuses
  applied: { label: 'Applied', variant: 'info', bg: 'rgba(6, 182, 212, 0.15)', text: '#38bdf8' },
  under_review: { label: 'Under Review', variant: 'warning', bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
  shortlisted: { label: 'Shortlisted', variant: 'primary', bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  technical_round: { label: 'Tech Round', variant: 'purple', bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc' },
  hr_round: { label: 'HR Round', variant: 'purple', bg: 'rgba(147, 51, 234, 0.15)', text: '#d8b4fe' },
  offered: { label: 'Offer Received', variant: 'success', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  selected: { label: 'Selected', variant: 'success', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  rejected: { label: 'Not Selected', variant: 'danger', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
  withdrawn: { label: 'Withdrawn', variant: 'neutral', bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8' },

  // Drive statuses
  active: { label: 'Active Drive', variant: 'success', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  upcoming: { label: 'Upcoming', variant: 'info', bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8' },
  closed: { label: 'Registrations Closed', variant: 'neutral', bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8' },

  // Eligibility
  eligible: { label: 'Eligible', variant: 'success', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  ineligible: { label: 'Not Eligible', variant: 'danger', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
  pending: { label: 'Verification Pending', variant: 'warning', bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },

  // Interview
  scheduled: { label: 'Scheduled', variant: 'info', bg: 'rgba(6, 182, 212, 0.15)', text: '#38bdf8' },
  completed: { label: 'Completed', variant: 'neutral', bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8' }
};

export function getStatusConfig(statusKey) {
  if (!statusKey) return { label: 'Unknown', variant: 'neutral', bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8' };
  const normalized = String(statusKey).toLowerCase().replace(/[\s-]/g, '_');
  return STATUS_CONFIG[normalized] || {
    label: statusKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    variant: 'neutral',
    bg: 'rgba(100, 116, 139, 0.15)',
    text: '#cbd5e1'
  };
}
