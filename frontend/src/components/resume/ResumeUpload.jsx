import React, { useState, useRef } from 'react';
import Button from '../common/Button';

/**
 * ResumeUpload Component
 * Supports PDF resume upload and displays uploaded resume metadata
 */
export default function ResumeUpload({ resumeInfo, onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setFileError(null);
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Invalid file type. Please upload a PDF document.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && onUpload) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box / Dropzone */}
      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`p-6 md:p-8 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="resume-file-input"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
          📄
        </div>

        <h3 className="text-base font-bold text-white mb-1">Upload Your Candidate Resume</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Drag and drop your resume in PDF format or click below to browse from your device (Max 10MB).
        </p>

        {fileError && (
          <div className="mb-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
            ⚠️ {fileError}
          </div>
        )}

        {selectedFile ? (
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 mb-4 max-w-md w-full justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="text-emerald-400 font-bold">PDF</span>
              <span className="font-semibold text-white truncate">{selectedFile.name}</span>
              <span className="text-slate-400 text-[11px]">
                ({(selectedFile.size / 1024).toFixed(0)} KB)
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                id="btn-upload-submit"
                variant="primary"
                size="sm"
                type="submit"
                loading={loading}
              >
                Upload & Analyze
              </Button>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
                aria-label="Remove selected file"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <Button
            id="btn-browse-file"
            variant="outline"
            size="sm"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse PDF File
          </Button>
        )}
      </form>

      {/* Uploaded Resume Information Card */}
      {resumeInfo && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">
              PDF
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Active Analyzed Resume
              </div>
              <div className="text-sm font-bold text-white mt-0.5">{resumeInfo.fileName}</div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Size: <strong className="text-slate-300">{resumeInfo.fileSize}</strong></span>
                <span>•</span>
                <span>Uploaded: <strong className="text-slate-300">{resumeInfo.uploadedAt}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {resumeInfo.status || 'Verified & Analyzed'}
            </span>
            <Button
              id="btn-reupload-trigger"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Re-upload PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
