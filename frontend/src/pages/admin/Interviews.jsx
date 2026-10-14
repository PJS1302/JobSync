import React, { useState, useEffect } from 'react';
import InterviewForm from '../../components/admin/InterviewForm';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  getAdminInterviews,
  createInterview,
  scheduleInterview,
  updateInterviewStatus,
  getCompanies,
  getApplicants
} from '../../services/placementService';

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [intRes, compRes, appRes] = await Promise.all([
        getAdminInterviews(),
        getCompanies(),
        getApplicants()
      ]);
      if (intRes.success && intRes.data) {
        setInterviews(intRes.data);
      }
      if (compRes.success && compRes.data) {
        setCompanies(compRes.data);
      }
      if (appRes.success && appRes.data) {
        setApplicants(appRes.data);
      }
    } catch (err) {
      console.error('Error fetching admin interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSchedule = () => {
    setEditingInterview(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingInterview?.id) {
      await updateInterviewStatus(editingInterview.id, formData.status);
    } else {
      await scheduleInterview(formData);
    }
    await loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateInterviewStatus(id, newStatus);
    await loadData();
  };

  const filteredInterviews = interviews.filter((i) => {
    const matchesSearch =
      i.company?.toLowerCase().includes(search.toLowerCase()) ||
      i.candidate?.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.candidate?.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
      i.round?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Interview Coordination & Scheduling
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create interview rounds, schedule candidate evaluation sessions, and update round statuses
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenSchedule}
          className="shadow-lg shadow-blue-500/20 text-xs shrink-0"
        >
          + Schedule New Interview
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, student candidate, or evaluation round..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-4 h-4 text-slate-500 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Interviews Grid */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader text="Loading interview sessions..." />
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
            📅
          </div>
          <h4 className="text-base font-semibold text-white">No interviews found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Schedule an interview session for shortlisted candidates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredInterviews.map((int) => (
            <div
              key={int.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{int.company}</h3>
                    <p className="text-xs text-slate-300 font-medium">{int.role}</p>
                  </div>
                  <StatusBadge status={int.status} />
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 mt-3 space-y-2">
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>{int.round}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
                    <div>📅 {int.date}</div>
                    <div>⏰ {int.time}</div>
                  </div>

                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Mode: </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-200">
                      {int.mode}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 truncate">
                    <span className="font-semibold text-slate-300">Location / Link: </span>
                    {int.locationLink?.startsWith('http') ? (
                      <a
                        href={int.locationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        {int.locationLink}
                      </a>
                    ) : (
                      <span>{int.locationLink}</span>
                    )}
                  </div>
                </div>

                {/* Candidate badge */}
                <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {int.candidate?.name?.[0] || 'C'}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-white">{int.candidate?.name}</div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      {int.candidate?.rollNo} • {int.candidate?.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-400">Update Status:</span>
                <select
                  value={int.status}
                  onChange={(e) => handleStatusChange(int.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Schedule Interview Modal */}
      <InterviewForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingInterview}
        companies={companies}
        applicants={applicants}
      />
    </div>
  );
}
