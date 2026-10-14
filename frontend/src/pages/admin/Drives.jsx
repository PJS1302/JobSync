import React, { useState, useEffect } from 'react';
import DriveForm from '../../components/admin/DriveForm';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  getPlacementDrives,
  createDrive,
  updateDrive,
  publishDrive,
  closeDrive,
  getCompanies
} from '../../services/placementService';

export default function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [driveRes, compRes] = await Promise.all([
        getPlacementDrives(),
        getCompanies()
      ]);
      if (driveRes.success && driveRes.data) {
        setDrives(driveRes.data);
      }
      if (compRes.success && compRes.data) {
        setCompanies(compRes.data);
      }
    } catch (err) {
      console.error('Error fetching drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingDrive(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (drive) => {
    setEditingDrive(drive);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingDrive?.id) {
      await updateDrive(editingDrive.id, formData);
    } else {
      await createDrive(formData);
    }
    await loadData();
  };

  const handlePublish = async (driveId) => {
    try {
      setActionLoadingId(driveId);
      await publishDrive(driveId);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleClose = async (driveId) => {
    try {
      setActionLoadingId(driveId);
      await closeDrive(driveId);
      await loadData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredDrives = drives.filter((d) => {
    const matchesSearch =
      d.company?.toLowerCase().includes(search.toLowerCase()) ||
      d.role?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase());

    const isPublished = d.status === 'published' || d.status === 'active';
    const isClosed = d.status === 'closed';

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && isPublished) ||
      (statusFilter === 'CLOSED' && isClosed);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Placement Drives Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, publish, and close recruitment drives for eligible students
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          className="shadow-lg shadow-blue-500/20 text-xs shrink-0"
        >
          + Launch New Drive
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drives by company name, designation, or location..."
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
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active / Published
            </button>
            <button
              onClick={() => setStatusFilter('CLOSED')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'CLOSED'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Closed
            </button>
          </div>
        </div>
      </div>

      {/* Drives List */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader text="Loading placement drives..." />
        </div>
      ) : filteredDrives.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
            📋
          </div>
          <h4 className="text-base font-semibold text-white">No drives found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new placement drive.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrives.map((drive) => {
            const isClosed = drive.status === 'closed';
            const isActionBusy = actionLoadingId === drive.id;

            return (
              <div
                key={drive.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-slate-700 transition-all"
              >
                {/* Left info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                      {drive.category || 'General'}
                    </span>
                    <StatusBadge status={drive.status} />
                    <span className="text-xs text-slate-400 font-mono">ID: {drive.id}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{drive.company}</h3>
                    <p className="text-sm text-slate-300 font-medium">{drive.role}</p>
                  </div>

                  <p className="text-xs text-slate-400 max-w-3xl line-clamp-2">
                    {drive.description}
                  </p>

                  {/* Skills tags */}
                  {drive.requiredSkills && drive.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-500 font-medium mr-1">Skills:</span>
                      {drive.requiredSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Criteria row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                    <span>
                      Package: <strong className="text-emerald-400">{drive.package}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Min CGPA: <strong className="text-white">{drive.eligibility?.minCgpa ?? 'N/A'}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Max Backlogs: <strong className="text-white">{drive.eligibility?.maxBacklogs ?? 0}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Deadline: <strong className="text-slate-300">{drive.deadline || 'Ongoing'}</strong>
                    </span>
                  </div>
                </div>

                {/* Right action buttons */}
                <div className="flex flex-wrap items-center gap-2.5 lg:border-l lg:border-slate-800 lg:pl-6 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(drive)}
                    className="text-xs py-1.5 px-3 text-slate-300 hover:text-white"
                  >
                    Edit Drive
                  </Button>

                  {isClosed ? (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isActionBusy}
                      onClick={() => handlePublish(drive.id)}
                      className="text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
                    >
                      {isActionBusy ? 'Publishing...' : 'Publish'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isActionBusy}
                      onClick={() => handleClose(drive.id)}
                      className="text-xs py-1.5 px-3 text-slate-400 hover:text-rose-400 hover:border-rose-500/40"
                    >
                      {isActionBusy ? 'Closing...' : 'Close Drive'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Drive Modal */}
      <DriveForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingDrive}
        companies={companies}
      />
    </div>
  );
}
