import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnalyticsCards from '../../components/admin/AnalyticsCards';
import CandidateTable from '../../components/admin/CandidateTable';
import CompanyForm from '../../components/admin/CompanyForm';
import DriveForm from '../../components/admin/DriveForm';
import InterviewForm from '../../components/admin/InterviewForm';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  getPlacementAnalytics,
  getCompanies,
  createCompany,
  getPlacementDrives,
  createDrive,
  publishDrive,
  closeDrive,
  getApplicants,
  shortlistApplicant,
  rejectApplicant,
  getAdminInterviews,
  scheduleInterview
} from '../../services/placementService';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);

  // Modals state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, compRes, driveRes, appRes, intRes] = await Promise.all([
        getPlacementAnalytics(),
        getCompanies(),
        getPlacementDrives(),
        getApplicants(),
        getAdminInterviews()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (compRes.success) setCompanies(compRes.data);
      if (driveRes.success) setDrives(driveRes.data);
      if (appRes.success) setApplicants(appRes.data);
      if (intRes.success) setInterviews(intRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCompany = async (formData) => {
    await createCompany(formData);
    await loadData();
  };

  const handleCreateDrive = async (formData) => {
    await createDrive(formData);
    await loadData();
  };

  const handleScheduleInterview = async (formData) => {
    await scheduleInterview(formData);
    await loadData();
  };

  const handlePublishDrive = async (driveId) => {
    await publishDrive(driveId);
    await loadData();
  };

  const handleCloseDrive = async (driveId) => {
    await closeDrive(driveId);
    await loadData();
  };

  const handleShortlistApplicant = async (appId) => {
    try {
      setActionLoadingId(appId);
      await shortlistApplicant(appId);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectApplicant = async (appId) => {
    try {
      setActionLoadingId(appId);
      await rejectApplicant(appId);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size="lg" text="Loading Placement Officer Workspace..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Placement Officer Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Placement Officer Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Placement & Career Operations Hub
          </h1>
          <p className="text-sm text-slate-300">
            Coordinate campus recruitment drives, review student screening with AI match scores, schedule candidate interviews, and track placement statistics.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompanyModal(true)}
            className="text-xs"
          >
            + Add Company
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowInterviewModal(true)}
            className="text-xs"
          >
            + Schedule Interview
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowDriveModal(true)}
            className="text-xs shadow-lg shadow-blue-500/20"
          >
            + Launch Drive
          </Button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">Key Placement Metrics</h2>
          <Link
            to="/admin/analytics"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Detailed Analytics →
          </Link>
        </div>
        <AnalyticsCards analytics={analytics} />
      </section>

      {/* Active Drives Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Current Placement Drives</h2>
            <p className="text-xs text-slate-400">Live active and scheduled recruitment drives</p>
          </div>
          <Link
            to="/admin/drives"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Manage All Drives ({drives.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.slice(0, 3).map((drive) => {
            const isClosed = drive.status === 'closed';
            return (
              <div
                key={drive.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20 uppercase">
                      {drive.category || 'Drive'}
                    </span>
                    <StatusBadge status={drive.status} />
                  </div>
                  <h3 className="font-bold text-white text-base tracking-tight">{drive.company}</h3>
                  <p className="text-xs text-slate-300 font-medium">{drive.role}</p>
                  <div className="text-xs text-slate-400 mt-2 flex items-center justify-between font-mono">
                    <span>Package: <strong className="text-emerald-400">{drive.package}</strong></span>
                    <span>Min CGPA: {drive.eligibility?.minCgpa}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Deadline: {drive.deadline || 'Ongoing'}
                  </span>
                  <div className="flex items-center gap-2">
                    {isClosed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublishDrive(drive.id)}
                        className="text-xs py-1 px-2.5 text-emerald-400 hover:border-emerald-500"
                      >
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCloseDrive(drive.id)}
                        className="text-xs py-1 px-2.5 text-slate-400 hover:text-rose-400 hover:border-rose-500/40"
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Candidate Screening & Shortlisting Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Candidate Screening & Shortlisting
            </h2>
            <p className="text-xs text-slate-400">
              Review applicant profile data, AI resume match score, and take shortlist / reject actions
            </p>
          </div>
          <Link
            to="/admin/applicants"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All Applicants ({applicants.length}) →
          </Link>
        </div>

        <CandidateTable
          applicants={applicants.slice(0, 5)}
          onShortlist={handleShortlistApplicant}
          onReject={handleRejectApplicant}
          actionLoadingId={actionLoadingId}
        />
      </section>

      {/* Upcoming Interviews Pipeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Interview Pipeline</h2>
            <p className="text-xs text-slate-400">Scheduled candidate evaluation rounds</p>
          </div>
          <Link
            to="/admin/interviews"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Manage Interviews ({interviews.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.slice(0, 4).map((int) => (
            <div
              key={int.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{int.company}</span>
                  <StatusBadge status={int.status} />
                </div>
                <div className="text-xs text-slate-300 font-medium">{int.role}</div>
                <div className="text-xs text-blue-400">{int.round}</div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span>📅 {int.date}</span>
                  <span>⏰ {int.time}</span>
                  <span>📍 {int.mode}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Candidate: <strong className="text-slate-200">{int.candidate?.name}</strong> ({int.candidate?.rollNo})
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modals */}
      <CompanyForm
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSubmit={handleCreateCompany}
      />

      <DriveForm
        isOpen={showDriveModal}
        onClose={() => setShowDriveModal(false)}
        onSubmit={handleCreateDrive}
        companies={companies}
      />

      <InterviewForm
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        onSubmit={handleScheduleInterview}
        companies={companies}
        applicants={applicants}
      />
    </div>
  );
}
