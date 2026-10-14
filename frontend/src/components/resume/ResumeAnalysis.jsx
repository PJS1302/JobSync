import React from 'react';
import MatchScore from './MatchScore';
import SkillGap from './SkillGap';
import Loader from '../common/Loader';

/**
 * ResumeAnalysis Component
 * Consumes Student Service AI response and renders MatchScore and SkillGap modules
 */
export default function ResumeAnalysis({ analysisData, loading, error }) {
  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-8">
        <Loader size="lg" text="Student Service AI is analyzing resume credentials & skill relevance..." />
      </div>
    );
  }

  if (error && !analysisData) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-rose-500/30 text-center space-y-3">
        <div className="text-2xl">⚠️</div>
        <h3 className="text-base font-bold text-white">Analysis Unavailable</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
        <div className="text-3xl mb-2">📑</div>
        <h3 className="text-sm font-bold text-white">No Resume Analysis Yet</h3>
        <p className="text-xs text-slate-400 mt-1">
          Upload your PDF resume above to run the AI skill gap and drive compatibility analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Match Score Widget */}
      <MatchScore
        score={analysisData.matchScore}
        targetRole={analysisData.targetRole}
      />

      {/* 2. Skill Gap & Project Relevance */}
      <SkillGap
        matchedSkills={analysisData.matchedSkills}
        missingSkills={analysisData.missingSkills}
        projectRelevance={analysisData.projectRelevance}
        summaryNotes={analysisData.summaryNotes}
      />
    </div>
  );
}
