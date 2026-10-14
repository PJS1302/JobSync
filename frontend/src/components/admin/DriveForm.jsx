import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DEPARTMENT_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Data Science & Artificial Intelligence'
];

export default function DriveForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  companies = []
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    package: '',
    location: '',
    description: '',
    minCgpa: '7.5',
    maxBacklogs: '0',
    category: 'Dream',
    deadline: '',
    requiredSkills: '',
    departments: ['Computer Science & Engineering', 'Information Technology']
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        role: initialData.role || '',
        package: initialData.package || '',
        location: initialData.location || '',
        description: initialData.description || '',
        minCgpa: String(initialData.eligibility?.minCgpa ?? 7.5),
        maxBacklogs: String(initialData.eligibility?.maxBacklogs ?? 0),
        category: initialData.category || 'Dream',
        deadline: initialData.deadline || '',
        requiredSkills: Array.isArray(initialData.requiredSkills)
          ? initialData.requiredSkills.join(', ')
          : initialData.requiredSkills || '',
        departments: initialData.eligibility?.departments || [
          'Computer Science & Engineering',
          'Information Technology'
        ]
      });
    } else {
      setFormData({
        company: companies[0]?.name || '',
        role: '',
        package: '',
        location: '',
        description: '',
        minCgpa: '7.5',
        maxBacklogs: '0',
        category: 'Dream',
        deadline: '',
        requiredSkills: '',
        departments: ['Computer Science & Engineering', 'Information Technology']
      });
    }
    setError(null);
  }, [initialData, isOpen, companies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeptToggle = (dept) => {
    setFormData((prev) => {
      const exists = prev.departments.includes(dept);
      return {
        ...prev,
        departments: exists
          ? prev.departments.filter((d) => d !== dept)
          : [...prev.departments, dept]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) {
      setError('Company and Role are required.');
      return;
    }
    if (formData.departments.length === 0) {
      setError('Select at least one eligible department.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        ...formData,
        minCgpa: parseFloat(formData.minCgpa) || 7.0,
        maxBacklogs: parseInt(formData.maxBacklogs, 10) || 0,
        requiredSkills: formData.requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save placement drive.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Placement Drive' : 'Launch New Placement Drive'}
      subtitle="Configure drive parameters, eligibility criteria, and job specifications"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Recruiting Company *
            </label>
            {companies.length > 0 ? (
              <select
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Partner Company</option>
                {companies.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Job Designation / Role *
            </label>
            <input
              type="text"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Associate Software Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Package CTC
            </label>
            <input
              type="text"
              name="package"
              value={formData.package}
              onChange={handleChange}
              placeholder="e.g. ₹18 - 22 LPA"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Job Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bengaluru / Hybrid"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Super Dream">Super Dream</option>
              <option value="Dream">Dream</option>
              <option value="Core">Core</option>
              <option value="Specialized">Specialized</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Job Description & Overview
          </label>
          <textarea
            rows="3"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Key responsibilities, team details, and tech expectations..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Min CGPA Cutoff
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              name="minCgpa"
              value={formData.minCgpa}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Max Active Backlogs
            </label>
            <input
              type="number"
              min="0"
              max="5"
              name="maxBacklogs"
              value={formData.maxBacklogs}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Application Deadline
            </label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              placeholder="YYYY-MM-DD (e.g. 2026-11-20)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Required Technical Skills (Comma separated)
          </label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="e.g. Node.js, React, MongoDB, System Design"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Eligible Academic Departments ({formData.departments.length} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEPARTMENT_OPTIONS.map((dept) => {
              const isSelected = formData.departments.includes(dept);
              return (
                <button
                  type="button"
                  key={dept}
                  onClick={() => handleDeptToggle(dept)}
                  className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="truncate pr-2">{dept}</span>
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-blue-600 text-white' : 'border border-slate-600 text-transparent'
                  }`}>
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {isEditing ? 'Save Drive Changes' : 'Publish Placement Drive'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
