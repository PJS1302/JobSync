import React, { useState, useEffect } from 'react';
import ResumeUpload from '../../components/resume/ResumeUpload';
import ResumeAnalysis from '../../components/resume/ResumeAnalysis';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getResumeAnalysis, uploadAndAnalyzeResume } from '../../services/resumeService';

/**
 * Student Resume Page Module
 * Consumes Student Service AI response to display uploaded resume info,
 * AI match score, matched skills, missing skills, and project relevance.
 */
export default function Resume() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Fetch existing resume analysis
  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getResumeAnalysis();
      if (res.success && res.data) {
        setAnalysisData(res.data);
        setIsLiveApi(Boolean(res.isLive));
      } else {
        throw new Error(res.message || 'Failed to retrieve resume analysis');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with Student Service AI endpoint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  // Upload PDF resume handler
  const handleUploadResume = async (file) => {
    setUploading(true);
    setFeedbackNotice(null);
    setError(null);

    try {
      const res = await uploadAndAnalyzeResume(file);
      if (res.success && res.data) {
        setAnalysisData(res.data);
        setIsLiveApi(Boolean(res.isLive));
        setFeedbackNotice(`Resume "${file.name}" uploaded and evaluated by Student Service AI!`);
        setTimeout(() => setFeedbackNotice(null), 4000);
      } else {
        throw new Error(res.message || 'Failed to process resume upload');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload and analyze resume');
    } finally {
      setUploading(false);
    }
  };

  // 1. Initial Page Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading AI resume evaluation & skill gap metrics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Resume Evaluation</h1>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isLiveApi
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {isLiveApi ? '● Student Service AI Connected' : '● Local Analysis Cache'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Student Service AI analyzes your resume PDF against placement drive criteria to evaluate skill gaps and project relevance.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAnalysis}>
          Refresh Analysis
        </Button>
      </div>

      {/* Success Notice Feedback */}
      {feedbackNotice && (
        <div
          id="resume-feedback-notice"
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3 animate-fadeIn"
        >
          <span className="text-base font-bold">✓</span>
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Error Notice Feedback */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-3">
          <span className="text-base font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* 1. PDF Resume Upload & Information Component */}
      <section aria-label="Resume Upload & Metadata">
        <ResumeUpload
          resumeInfo={analysisData?.resumeInfo}
          onUpload={handleUploadResume}
          loading={uploading}
        />
      </section>

      {/* 2. Resume AI Analysis Component (MatchScore & SkillGap) */}
      <section aria-label="AI Resume Analysis & Skill Gap">
        <ResumeAnalysis
          analysisData={analysisData}
          loading={uploading}
          error={error}
        />
      </section>
    </div>
  );
}
