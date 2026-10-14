import React from 'react';

export default function AnalyticsCards({ analytics = {} }) {
  const {
    companies = 0,
    drives = 0,
    applications = 0,
    shortlisted = 0,
    interviews = 0,
    selected = 0,
    placementRate = 86,
    highestPackage = '₹28.0 LPA',
    averagePackage = '₹17.4 LPA'
  } = analytics;

  const KPI_METRICS = [
    {
      label: 'Recruiting Companies',
      value: companies,
      subtext: 'Active Corporate Partners',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      glow: 'from-blue-600/20 to-blue-500/5',
      border: 'border-blue-500/20'
    },
    {
      label: 'Placement Drives',
      value: drives,
      subtext: 'Total Campus Drives',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      glow: 'from-indigo-600/20 to-indigo-500/5',
      border: 'border-indigo-500/20'
    },
    {
      label: 'Total Applications',
      value: applications,
      subtext: 'Student Applications',
      icon: (
        <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      glow: 'from-sky-600/20 to-sky-500/5',
      border: 'border-sky-500/20'
    },
    {
      label: 'Candidates Shortlisted',
      value: shortlisted,
      subtext: 'Screening Qualified',
      icon: (
        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      glow: 'from-violet-600/20 to-violet-500/5',
      border: 'border-violet-500/20'
    },
    {
      label: 'Interviews Scheduled',
      value: interviews,
      subtext: 'Evaluation Rounds',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      glow: 'from-amber-600/20 to-amber-500/5',
      border: 'border-amber-500/20'
    },
    {
      label: 'Final Offers / Selected',
      value: selected,
      subtext: 'Job Offers Accepted',
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      glow: 'from-emerald-600/20 to-emerald-500/5',
      border: 'border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 6 Core KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_METRICS.map((kpi, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-br ${kpi.glow} bg-slate-900 border ${kpi.border} shadow-lg backdrop-blur-sm flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                {kpi.icon}
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">{kpi.value}</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5 leading-snug">{kpi.label}</div>
              <div className="text-[10px] text-slate-400 mt-1">{kpi.subtext}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Placement Statistics Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Campus Placement Rate
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{placementRate}%</div>
            <div className="text-xs text-slate-400 mt-0.5">Eligible batch placement progress</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            📈
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Highest Package
            </div>
            <div className="text-2xl font-black text-blue-400 mt-1">{highestPackage}</div>
            <div className="text-xs text-slate-400 mt-0.5">QuantumFin Tech • Super Dream</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
            🏆
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average CTC Package
            </div>
            <div className="text-2xl font-black text-indigo-400 mt-1">{averagePackage}</div>
            <div className="text-xs text-slate-400 mt-0.5">Across all confirmed corporate offers</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            💼
          </div>
        </div>
      </div>
    </div>
  );
}
