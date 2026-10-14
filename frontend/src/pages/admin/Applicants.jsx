import React, { useState, useEffect } from 'react';
import CandidateTable from '../../components/admin/CandidateTable';
import Loader from '../../components/common/Loader';
import {
  getApplicants,
  shortlistApplicant,
  rejectApplicant,
  getPlacementDrives
} from '../../services/placementService';

export default function AdminApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [driveFilter, setDriveFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appRes, driveRes] = await Promise.all([
        getApplicants(),
        getPlacementDrives()
      ]);
      if (appRes.success && appRes.data) {
        setApplicants(appRes.data);
      }
      if (driveRes.success && driveRes.data) {
        setDrives(driveRes.data);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShortlist = async (appId) => {
    try {
      setActionLoadingId(appId);
      await shortlistApplicant(appId);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (appId) => {
    try {
      setActionLoadingId(appId);
      await rejectApplicant(appId);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.student?.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
      app.student?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesDrive = driveFilter === 'ALL' || app.driveId === driveFilter;
    const matchesStatus = statusFilter === 'ALL' || app.applicationStatus === statusFilter;
    const matchesDept = deptFilter === 'ALL' || app.department === deptFilter;

    return matchesSearch && matchesDrive && matchesStatus && matchesDept;
  });

  const shortlistedCount = applicants.filter((a) => a.applicationStatus === 'Shortlisted').length;
  const rejectedCount = applicants.filter((a) => a.applicationStatus === 'Rejected').length;
  const pendingCount = applicants.filter((a) => a.applicationStatus === 'Applied').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Applicant Screening & Evaluation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review candidate eligibility, AI resume match score, and take shortlist or reject actions
        </p>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Applicants</div>
          <div className="text-2xl font-black text-white mt-1">{applicants.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-amber-400 uppercase">Pending Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-emerald-400 uppercase">Shortlisted</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{shortlistedCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="text-xs font-semibold text-rose-400 uppercase">Rejected</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or roll number..."
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

        {/* Filter by Drive */}
        <select
          value={driveFilter}
          onChange={(e) => setDriveFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Placement Drives</option>
          {drives.map((d) => (
            <option key={d.id} value={d.id}>
              {d.company} — {d.role}
            </option>
          ))}
        </select>

        {/* Filter by Department */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Departments</option>
          <option value="Computer Science & Engineering">CSE</option>
          <option value="Information Technology">IT</option>
          <option value="Electronics & Communication Engineering">ECE</option>
          <option value="Data Science & Artificial Intelligence">AI & DS</option>
        </select>

        {/* Filter by Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="Applied">Applied (Pending)</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Candidate Table */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader text="Loading applicants..." />
        </div>
      ) : (
        <CandidateTable
          applicants={filteredApplicants}
          onShortlist={handleShortlist}
          onReject={handleReject}
          actionLoadingId={actionLoadingId}
        />
      )}
    </div>
  );
}
