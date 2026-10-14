import React from 'react';

/**
 * SkillGap Component
 * Displays Matched Skills (✓), Missing Skills (✗), and Project Relevance feedback
 */
export default function SkillGap({
  matchedSkills = [],
  missingSkills = [],
  projectRelevance = [],
  summaryNotes = ''
}) {
  return (
    <div className="space-y-6">
      {/* Matched vs Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills Box */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                ✓
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Matched Skills ({matchedSkills.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Verified in Resume
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Skills extracted from your resume that directly fulfill the requirements of active placement drives:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shadow-sm"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills Box */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 font-bold flex items-center justify-center text-xs">
                ✗
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Missing Skills ({missingSkills.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              Action Recommended
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Prerequisites sought by target companies not explicitly found in your parsed credentials:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-semibold shadow-sm"
              >
                <span className="text-rose-400 font-bold">✗</span>
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Project Relevance Section */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Project Relevance Analysis</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              AI evaluation of candidate portfolio projects against campus recruiter benchmarks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {projectRelevance.map((proj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-extrabold shrink-0 ${
                      proj.relevanceScore >= 85
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {proj.relevanceScore}% Relevance
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{proj.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        {summaryNotes && (
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5 mt-2">
            <span className="text-base">💡</span>
            <div className="leading-relaxed">
              <strong>Recruiter Insight:</strong> {summaryNotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
