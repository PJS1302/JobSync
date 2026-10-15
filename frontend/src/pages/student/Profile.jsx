import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getStudentProfile, updateStudentProfile } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & Artificial Intelligence'
];

/**
 * Student Profile Page Module
 * Supports: name, email, phone, department, graduationYear, cgpa, backlogs, skills
 * Handles loading, error, and empty states.
 */
export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Skill input state
  const [newSkill, setNewSkill] = useState('');

  // Fetch initial profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentProfile(user?.studentId || user?.id || user?.email);
      if (res.success && res.data) {
        const data = { ...res.data };
        if (user?.name && (data.name === 'Alex Rivera' || !data.name)) {
          data.name = user.name;
        }
        if (user?.email && (data.email === 'alex.rivera@campus.edu' || !data.email)) {
          data.email = user.email;
        }
        if (user?.department && (!data.department || data.department === 'Computer Science & Engineering')) {
          data.department = user.department;
        }
        setProfile(data);
        setIsLiveApi(Boolean(res.isLive));
      } else {
        throw new Error(res.message || 'Failed to retrieve student profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id, user?.name]);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  // Add skill handler
  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    if (!profile.skills.includes(trimmed)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), trimmed]
      }));
    }
    setNewSkill('');
  };

  // Remove skill handler
  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((s) => s !== skillToRemove)
    }));
  };

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessNotice(null);
    setError(null);

    try {
      const res = await updateStudentProfile(profile);
      if (res.success) {
        setSuccessNotice('Profile saved successfully! Changes are updated in your student record.');
        setIsLiveApi(Boolean(res.isLive));
        setTimeout(() => setSuccessNotice(null), 4000);
      } else {
        throw new Error(res.message || 'Failed to save profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while saving profile');
    } finally {
      setSaving(false);
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading student profile details..." />
      </div>
    );
  }

  // 2. Error State (when profile failed to load completely)
  if (error && !profile) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Unable to Load Profile</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchProfile}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Student Profile</h1>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isLiveApi
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {isLiveApi ? '● Live API' : '● Local Cache'}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Keep your academic and contact information updated to maintain eligibility in placement drives.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div
          id="profile-success-notice"
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fadeIn"
        >
          <span className="text-lg">✓</span>
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      {/* Error Alert during saving */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Personal & Academic Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Name */}
          <div>
            <label htmlFor="field-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <input
              id="field-name"
              name="name"
              type="text"
              required
              value={profile?.name || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="e.g. Alex Rivera"
            />
          </div>

          {/* 2. Email */}
          <div>
            <label htmlFor="field-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <input
              id="field-email"
              name="email"
              type="email"
              required
              value={profile?.email || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="e.g. alex.rivera@campus.edu"
            />
          </div>

          {/* 3. Phone */}
          <div>
            <label htmlFor="field-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Phone Number
            </label>
            <input
              id="field-phone"
              name="phone"
              type="tel"
              value={profile?.phone || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="e.g. +1 (555) 234-5678"
            />
          </div>

          {/* 4. Department */}
          <div>
            <label htmlFor="field-department" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Department
            </label>
            <select
              id="field-department"
              name="department"
              value={profile?.department || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-white">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Graduation Year */}
          <div>
            <label htmlFor="field-graduationYear" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Graduation Year
            </label>
            <input
              id="field-graduationYear"
              name="graduationYear"
              type="number"
              min="2020"
              max="2035"
              required
              value={profile?.graduationYear || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* 6. CGPA */}
          <div>
            <label htmlFor="field-cgpa" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Current CGPA (Out of 10)
            </label>
            <input
              id="field-cgpa"
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              required
              value={profile?.cgpa || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* 7. Backlogs */}
          <div>
            <label htmlFor="field-backlogs" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Active Backlogs Count
            </label>
            <input
              id="field-backlogs"
              name="backlogs"
              type="number"
              min="0"
              max="30"
              required
              value={profile?.backlogs ?? 0}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Most placement drives require 0 active backlogs for initial screening.
            </span>
          </div>
        </div>

        {/* 8. Technical Skills Tag Cluster */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Technical & Soft Skills
          </label>

          {/* Empty Skills State */}
          {(!profile?.skills || profile.skills.length === 0) ? (
            <div className="p-4 rounded-lg bg-slate-800/30 border border-dashed border-slate-700 text-xs text-slate-500 mb-4 text-center">
              No skills added yet. Add your programming languages, frameworks, and technical competencies below.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 group transition-all"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400 transition-colors font-bold ml-1 text-slate-400"
                    aria-label={`Remove skill ${skill}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Skill Adder Input */}
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              id="input-new-skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. Next.js, PostgreSQL, AWS"
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              id="btn-add-skill"
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleAddSkill}
            >
              Add Skill
            </Button>
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
          <Button
            id="btn-save-profile"
            variant="primary"
            type="submit"
            loading={saving}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
