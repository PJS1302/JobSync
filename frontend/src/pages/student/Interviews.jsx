import React, { useState, useEffect } from 'react';
import InterviewSchedule from '../../components/interviews/InterviewSchedule';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getStudentInterviews } from '../../services/interviewService';

/**
 * Student Interviews Page Module
 * Displays scheduled interview rounds and evaluations
 */
export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const fetchInterviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentInterviews();
      if (res.success && res.data) {
        setInterviews(res.data);
        setIsLiveApi(Boolean(res.isLive));
      } else {
        throw new Error(res.message || 'Failed to load interview rounds');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with Student Service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading your interview schedules & evaluation rounds..." />
      </div>
    );
  }

  // 2. Error State
  if (error && interviews.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Failed to Load Interview Schedule</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchInterviews}>
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
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Interview Schedule</h1>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isLiveApi
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {isLiveApi ? '● Live API' : '● Local Cache'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            View upcoming technical assessments, coding rounds, and interview meeting links.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchInterviews}>
          Refresh Schedule
        </Button>
      </div>

      {/* Main Schedule Container */}
      <InterviewSchedule interviews={interviews} />
    </div>
  );
}
