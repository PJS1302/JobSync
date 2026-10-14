import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { getPlacementDrives } from '../../services/placementService';

/**
 * Student Drives List Page
 * Displays available placement drives with filtering and navigation to details
 */
export default function Drives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPlacementDrives();
      if (res.success && res.data) {
        setDrives(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch placement drives');
      }
    } catch (err) {
      setError(err.message || 'Failed to communicate with Placement Service API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // Filter drives
  const filteredDrives = drives.filter((drive) => {
    const matchesSearch =
      drive.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || drive.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading active campus placement drives..." />
      </div>
    );
  }

  // 2. Error State
  if (error && drives.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Failed to Load Placement Drives</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchDrives}>
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Campus Placement Drives</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and apply to hiring drives open for your graduating cohort.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDrives}>
          Refresh Drives
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            id="input-search-drives"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role, or location..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'dream', 'super dream', 'core'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Empty State */}
      {filteredDrives.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-3xl mb-2">🔍</div>
          <h2 className="text-base font-bold text-white">No Placement Drives Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            No active drives match your current search criteria. Try modifying your filter or clear the search.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        /* Drives Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDrives.map((drive) => (
            <div
              key={drive.id}
              id={`drive-card-${drive.id}`}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {drive.role}
                    </h2>
                    <div className="text-xs font-semibold text-slate-300">{drive.company}</div>
                  </div>
                  <StatusBadge status={drive.status} />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{drive.description}</p>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    💰 {drive.package}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    📍 {drive.location}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    🎯 Min CGPA: {drive.eligibility?.minCgpa}
                  </span>
                </div>

                {/* Required Skills Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {drive.requiredSkills?.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-800/80 text-slate-400 border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {drive.requiredSkills?.length > 4 && (
                    <span className="px-1.5 py-0.5 text-[11px] text-slate-500">
                      +{drive.requiredSkills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  Deadline: <span className="text-white font-medium">{drive.deadline}</span>
                </div>
                <Link to={`/drives/${drive.id}`}>
                  <Button id={`btn-view-${drive.id}`} variant="primary" size="sm">
                    View Details →
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
