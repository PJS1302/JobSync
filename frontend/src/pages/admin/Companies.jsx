import React, { useState, useEffect } from 'react';
import CompanyForm from '../../components/admin/CompanyForm';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} from '../../services/placementService';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCompanies();
      if (res.success && res.data) {
        setCompanies(res.data);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingCompany(comp);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingCompany?.id) {
      await updateCompany(editingCompany.id, formData);
    } else {
      await createCompany(formData);
    }
    await loadData();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteCompany(id);
      setConfirmDeleteId(null);
      await loadData();
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());

    const matchesTier =
      tierFilter === 'ALL' || (c.tier && c.tier.toLowerCase().includes(tierFilter.toLowerCase()));

    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Corporate Recruiting Partners
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage participating recruiters, university hiring POCs, and campus tier agreements
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreate}
          className="shadow-lg shadow-blue-500/20 text-xs shrink-0"
        >
          + Add New Company
        </Button>
      </div>

      {/* Filters and search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, industry domain, or location..."
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
          <span className="text-xs text-slate-400 font-medium">Tier:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="Super Dream">Super Dream</option>
            <option value="Dream">Dream</option>
            <option value="Core">Core</option>
            <option value="Specialized">Specialized</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader text="Loading partner companies..." />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
            🏢
          </div>
          <h4 className="text-base font-semibold text-white">No companies found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or add a new recruiting partner.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((comp) => {
            const isDeleting = deletingId === comp.id;

            return (
              <div
                key={comp.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                      {comp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-semibold border border-blue-500/20">
                      {comp.tier || 'Recruiter'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{comp.name}</h3>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">{comp.industry}</p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{comp.location || 'India'}</span>
                    </div>
                    {comp.contactPerson && (
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span className="truncate">{comp.contactPerson}</span>
                      </div>
                    )}
                    {comp.contactEmail && (
                      <div className="flex items-center gap-2">
                        <span>✉️</span>
                        <span className="truncate text-blue-400">{comp.contactEmail}</span>
                      </div>
                    )}
                    {comp.website && (
                      <div className="flex items-center gap-2">
                        <span>🔗</span>
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate text-slate-400 hover:text-white transition-colors"
                        >
                          {comp.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Active Drives: <strong className="text-white">{comp.activeDrivesCount || 0}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenEdit(comp)}
                      className="text-xs py-1 px-2.5 text-slate-300 hover:text-white"
                    >
                      Edit
                    </Button>
                    {confirmDeleteId === comp.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDelete(comp.id)}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                        >
                          Confirm?
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[11px] px-1.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmDeleteId(comp.id)}
                        className="text-xs py-1 px-2.5 text-rose-400 hover:border-rose-500/40"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Company Modal */}
      <CompanyForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCompany}
      />
    </div>
  );
}
