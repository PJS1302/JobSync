import React from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';

export default function CandidateTable({
  applicants = [],
  onShortlist,
  onReject,
  actionLoadingId = null
}) {
  if (applicants.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
        <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h4 className="text-base font-semibold text-white">No applicants found</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No student applications match the specified criteria or filters.
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 75) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-800/80 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th className="py-4 px-4 sm:px-6">Student</th>
            <th className="py-4 px-4">Department</th>
            <th className="py-4 px-3 text-center">CGPA</th>
            <th className="py-4 px-4">Skills</th>
            <th className="py-4 px-4 text-center">AI Match Score</th>
            <th className="py-4 px-4 text-center">Application Status</th>
            <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          {applicants.map((app) => {
            const isLoading = actionLoadingId === app.id;
            const isShortlisted = app.applicationStatus === 'Shortlisted';
            const isRejected = app.applicationStatus === 'Rejected';
            const isSelected = app.applicationStatus === 'Selected';

            return (
              <tr
                key={app.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* Student */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md">
                      {app.student?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'ST'}
                    </div>
                    <div>
                      <div className="font-semibold text-white tracking-tight flex items-center gap-2">
                        {app.student?.name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-300">{app.student?.rollNo}</span>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">{app.student?.email}</span>
                      </div>
                      {app.driveCompany && (
                        <div className="text-[11px] text-blue-400/90 mt-1 font-medium">
                          Applied: {app.driveCompany} ({app.driveRole})
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="py-4 px-4">
                  <span className="inline-block text-xs text-slate-300 font-medium">
                    {app.department}
                  </span>
                </td>

                {/* CGPA */}
                <td className="py-4 px-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-white shadow-sm">
                    {Number(app.cgpa).toFixed(2)}
                  </span>
                </td>

                {/* Skills */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {(app.skills || []).slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {(app.skills || []).length > 4 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-mono">
                        +{app.skills.length - 4}
                      </span>
                    )}
                  </div>
                </td>

                {/* AI Match Score */}
                <td className="py-4 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${getScoreColor(
                        app.aiMatchScore || 0
                      )}`}
                    >
                      {app.aiMatchScore || 0}%
                    </span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (app.aiMatchScore || 0) >= 85
                            ? 'bg-emerald-500'
                            : (app.aiMatchScore || 0) >= 70
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(app.aiMatchScore || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Application Status */}
                <td className="py-4 px-4 text-center">
                  <StatusBadge status={app.applicationStatus} />
                </td>

                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isLoading || isShortlisted || isSelected}
                      onClick={() => onShortlist(app.id)}
                      className={`text-xs py-1 px-3 ${
                        isShortlisted
                          ? 'opacity-50 cursor-not-allowed bg-emerald-600/30 border-emerald-500/30 text-emerald-400'
                          : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500'
                      }`}
                    >
                      {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isLoading || isRejected || isSelected}
                      onClick={() => onReject(app.id)}
                      className={`text-xs py-1 px-2.5 ${
                        isRejected
                          ? 'opacity-50 cursor-not-allowed text-rose-400 border-rose-500/30'
                          : 'text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                      }`}
                    >
                      {isRejected ? 'Rejected' : 'Reject'}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
