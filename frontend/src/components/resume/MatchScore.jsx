import React from 'react';

/**
 * MatchScore Component
 * Displays the AI match score percentage and compatibility assessment
 */
export default function MatchScore({ score = 86, targetRole = 'Full Stack Cloud Engineer' }) {
  // Score color tiers
  const getScoreColor = (val) => {
    if (val >= 80) return { text: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/10', label: 'Strong Match' };
    if (val >= 60) return { text: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10', label: 'Moderate Match' };
    return { text: 'text-rose-400', stroke: '#ef4444', bg: 'bg-rose-500/10', label: 'Needs Improvement' };
  };

  const scoreTier = getScoreColor(score);

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            AI Placement Match Score
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${scoreTier.bg} ${scoreTier.text} border border-current/20`}>
            {scoreTier.label}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          Target Role: {targetRole}
        </h2>
        <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
          Evaluated by the Student Service AI engine based on verified technical skills, project implementation depth, and current campus placement drive specifications.
        </p>
      </div>

      {/* Prominent Score Card Badge */}
      <div className="flex items-center gap-5 shrink-0 bg-slate-800/40 border border-slate-700/60 p-4 rounded-2xl">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Circular progress SVG */}
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              stroke={scoreTier.stroke}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-white tracking-tight">{score}%</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400">Drive Compatibility</div>
          <div className="text-sm font-bold text-white mt-0.5">{score >= 80 ? 'Directly Eligible' : 'Gap Identified'}</div>
          <div className="text-[11px] text-slate-500 mt-1">Benchmark: &ge; 75% for Dream Tier</div>
        </div>
      </div>
    </div>
  );
}
