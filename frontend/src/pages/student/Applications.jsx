import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { getStudentApplications } from '../../services/studentService';

/**
 * Student Applications Page Module
 * Lists active and completed job applications with current timeline stage
 */
export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch student applications');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with Student Service API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading your placement applications..." />
      </div>
    );
  }

  // 2. Error State
  if (error && applications.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Unable to Load Applications</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchApplications}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">My Drive Applications</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your recruitment progress across screening, interviews, and final selection rounds.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/drives">
            <Button variant="primary" size="sm">
              Explore Open Drives
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={fetchApplications}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
        {['all', 'applied', 'shortlisted', 'interview', 'selected', 'rejected'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 3. Empty State */}
      {filteredApps.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-3xl mb-2">📄</div>
          <h2 className="text-base font-bold text-white">No Applications Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            {statusFilter === 'all'
              ? "You haven't submitted any placement drive applications yet. Check out open company drives and apply."
              : `No applications currently in the "${statusFilter}" stage.`}
          </p>
          <Link to="/drives">
            <Button variant="primary" size="sm">
              Browse Open Drives →
            </Button>
          </Link>
        </div>
      ) : (
        /* Applications List */
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              id={`application-card-${app.id}`}
              className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-white">{app.company}</h2>
                  <StatusBadge status={app.status} />
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {app.role} • <span className="text-emerald-400">{app.package}</span> • {app.location}
                </div>
                <div className="text-[11px] text-slate-500">
                  Applied on: <strong className="text-slate-400 font-medium">{app.appliedDate}</strong>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col md:items-end gap-3">
                <div className="text-xs text-slate-400">
                  Current Stage: <span className="text-blue-400 font-semibold">{app.currentStage || app.status}</span>
                </div>
                <Link to={`/applications/${app.id}`}>
                  <Button id={`btn-view-app-${app.id}`} variant="outline" size="sm">
                    View Status Timeline →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
