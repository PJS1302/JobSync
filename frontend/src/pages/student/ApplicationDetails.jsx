import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { getApplicationById } from '../../services/studentService';

const TIMELINE_STAGES = [
  { key: 'applied', label: 'Applied', description: 'Application received and verified by Placement Cell' },
  { key: 'shortlisted', label: 'Shortlisted', description: 'Candidate profile cleared screening and GPA thresholds' },
  { key: 'interview', label: 'Interview', description: 'Technical, coding, or managerial evaluation rounds' },
  { key: 'decision', label: 'Selected / Rejected', description: 'Final hiring outcome and formal placement decision' }
];

/**
 * Application Details Page Module
 * Displays detailed application tracking with the required status timeline:
 * Applied -> Shortlisted -> Interview -> Selected / Rejected
 */
export default function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplicationById(id);
      if (res.success && res.data) {
        setApplication(res.data);
      } else {
        throw new Error(res.message || 'Application not found');
      }
    } catch (err) {
      setError(err.message || 'Error fetching application record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading application status timeline..." />
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || !application) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Application Record Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested application could not be located.'}</p>
        <Link to="/applications">
          <Button variant="primary" size="sm">
            ← Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  // Determine active stage progression index (0: Applied, 1: Shortlisted, 2: Interview, 3: Selected/Rejected)
  const getStageIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 0;
      case 'under_review':
      case 'shortlisted':
        return 1;
      case 'interview':
      case 'technical_round':
      case 'hr_round':
        return 2;
      case 'selected':
      case 'offered':
      case 'rejected':
        return 3;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(application.status);
  const isRejected = application.status?.toLowerCase() === 'rejected';
  const isSelected = application.status?.toLowerCase() === 'selected' || application.status?.toLowerCase() === 'offered';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/applications" className="hover:text-white transition-colors">
          My Applications
        </Link>
        <span>/</span>
        <span className="text-slate-200">{application.company}</span>
      </div>

      {/* Main Application Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{application.company}</h1>
            <StatusBadge status={application.status} />
          </div>
          <div className="text-sm text-slate-300 font-semibold">{application.role}</div>
          <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
            <span>💰 <strong className="text-emerald-400">{application.package}</strong></span>
            <span>📍 {application.location}</span>
            <span>📅 Applied: <strong className="text-white">{application.appliedDate}</strong></span>
          </div>
        </div>

        <Link to={`/drives/${application.driveId}`}>
          <Button variant="outline" size="sm">
            View Job Description →
          </Button>
        </Link>
      </div>

      {/* Required Application Status Timeline */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Application Status Timeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time stage tracking through drive selection rounds.
          </p>
        </div>

        {/* Timeline Pipeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8 my-4 ml-4">
          {TIMELINE_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex || (index === 3 && isSelected);
            const isCurrent = index === currentStageIndex && !isSelected && !isRejected;
            const isFailed = index === 3 && isRejected;

            // Step status styling
            let indicatorBg = 'bg-slate-800 text-slate-500 border-slate-700';
            let titleColor = 'text-slate-500';
            let statusPill = null;

            if (isCompleted) {
              indicatorBg = 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30';
              titleColor = 'text-white font-bold';
              statusPill = (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Completed ✓
                </span>
              );
            } else if (isCurrent) {
              indicatorBg = 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/40 animate-pulse';
              titleColor = 'text-blue-400 font-bold';
              statusPill = (
                <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  In Progress
                </span>
              );
            } else if (isFailed) {
              indicatorBg = 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30';
              titleColor = 'text-rose-400 font-bold';
              statusPill = (
                <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  Not Selected
                </span>
              );
            }

            // Custom labels for the final stage
            const stageLabel =
              index === 3
                ? isSelected
                  ? 'Selected ✓'
                  : isRejected
                  ? 'Rejected ✕'
                  : 'Selected / Rejected'
                : stage.label;

            return (
              <div key={stage.key} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${indicatorBg}`}
                >
                  {isCompleted ? '✓' : isFailed ? '✕' : index + 1}
                </div>

                {/* Content Box */}
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-sm ${titleColor}`}>{stageLabel}</span>
                    {statusPill}
                  </div>
                  <p className="text-xs text-slate-400">{stage.description}</p>

                  {/* Notes from timeline metadata if available */}
                  {application.timeline?.[index]?.notes && (
                    <div className="text-[11px] text-slate-300 font-mono pt-1">
                      ℹ️ {application.timeline[index].notes}
                    </div>
                  )}

                  {application.timeline?.[index]?.date && (
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      Timestamp: {application.timeline[index].date}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Placement drive coordinators review round progression synchronously.</span>
          <Link to="/applications">
            <Button variant="outline" size="sm">
              ← Return to Applications
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
