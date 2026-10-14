import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { getDriveById } from '../../services/placementService';
import { applyToPlacementDrive, getStudentApplications } from '../../services/studentService';

/**
 * Drive Details Page Module
 * Displays complete details for a specific placement drive:
 * Company, Role, Description, Package, Location, Required Skills, Eligibility, Deadline
 */
export default function DriveDetails() {
  const { id } = useParams();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(null);

  const fetchDriveDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDriveById(id);
      if (res.success && res.data) {
        setDrive(res.data);
      } else {
        throw new Error(res.message || 'Placement drive not found');
      }

      // Check if user already applied
      const appsRes = await getStudentApplications();
      if (appsRes.success && appsRes.data) {
        const found = appsRes.data.some((a) => a.driveId === id);
        if (found) setIsApplied(true);
      }
    } catch (err) {
      setError(err.message || 'Error fetching drive details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriveDetails();
  }, [id]);

  // Handle application submission
  const handleApply = async () => {
    if (!drive || isApplied) return;
    setApplying(true);
    setAppliedNotice(null);

    try {
      const res = await applyToPlacementDrive(drive);
      if (res.success) {
        setIsApplied(true);
        setAppliedNotice('Your application was submitted successfully! You can track its progress in Applications.');
      } else {
        throw new Error(res.message || 'Application submission failed');
      }
    } catch (err) {
      setAppliedNotice(`Error submitting application: ${err.message}`);
    } finally {
      setApplying(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading placement drive details..." />
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || !drive) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Drive Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested placement drive does not exist.'}</p>
        <Link to="/drives">
          <Button variant="primary" size="sm">
            ← Back to Drives
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/drives" className="hover:text-white transition-colors">
          Placement Drives
        </Link>
        <span>/</span>
        <span className="text-slate-200">{drive.company}</span>
      </div>

      {/* Main Drive Details Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
                {drive.category || 'Recruitment Drive'}
              </span>
              <StatusBadge status={drive.status} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{drive.role}</h1>
            <div className="text-base font-semibold text-slate-300 mt-1">{drive.company}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              id="btn-apply-drive"
              variant={isApplied ? 'outline' : 'primary'}
              size="md"
              loading={applying}
              disabled={isApplied}
              onClick={handleApply}
            >
              {isApplied ? 'Applied ✓' : 'Apply Now'}
            </Button>
          </div>
        </div>

        {/* Application Success Feedback Notice */}
        {appliedNotice && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between gap-3 animate-fadeIn">
            <span>{appliedNotice}</span>
            <Link to="/applications" className="font-bold underline hover:text-emerald-300">
              View Applications →
            </Link>
          </div>
        )}
      </div>

      {/* 8 Required Drive Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Core Specifications */}
        <div className="md:col-span-2 space-y-6">
          {/* 1. Description */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Job Description</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{drive.description}</p>
          </div>

          {/* 2. Required Skills */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {drive.requiredSkills?.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Detailed Eligibility Criteria */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Eligibility Criteria</h2>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">Minimum CGPA Required</span>
                <strong className="text-white text-sm">{drive.eligibility?.minCgpa} / 10</strong>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">Maximum Backlogs Allowed</span>
                <strong className="text-emerald-400 text-sm">{drive.eligibility?.maxBacklogs ?? 0} Backlogs</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/50">
                <span className="text-slate-400 block mb-1">Eligible Engineering Branches</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {drive.eligibility?.departments?.map((dept) => (
                    <span key={dept} className="px-2 py-0.5 rounded text-[11px] bg-slate-700/60 text-slate-200">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              {drive.eligibility?.criteriaNote && (
                <div className="p-3 rounded-lg bg-slate-800/40 text-slate-400 border border-slate-700/60">
                  ℹ️ {drive.eligibility.criteriaNote}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Key Details Summary */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Drive Summary</h2>

            {/* Package */}
            <div>
              <span className="text-xs text-slate-400">Compensation Package</span>
              <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{drive.package}</div>
            </div>

            {/* Location */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Job Location</span>
              <div className="text-sm font-semibold text-white mt-0.5">{drive.location}</div>
            </div>

            {/* Deadline */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Application Deadline</span>
              <div className="text-sm font-semibold text-rose-400 mt-0.5">{drive.deadline}</div>
            </div>

            {/* Status */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Drive Status</span>
              <div className="mt-1">
                <StatusBadge status={drive.status} />
              </div>
            </div>
          </div>

          <Link to="/drives" className="block">
            <Button variant="outline" size="sm" className="w-full">
              ← Return to All Drives
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
