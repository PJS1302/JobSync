import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const ROUND_OPTIONS = [
  'Aptitude & Coding Assessment',
  'Technical Round 1 (Data Structures & Core)',
  'Technical Round 2 (System Design & Projects)',
  'Managerial Evaluation',
  'HR & Cultural Alignment Discussion'
];

export default function InterviewForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  companies = [],
  applicants = []
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    studentName: '',
    studentRoll: '',
    studentEmail: '',
    round: 'Technical Round 1 (Data Structures & Core)',
    date: '',
    time: '10:00 AM - 11:00 AM IST',
    mode: 'Online',
    locationLink: 'https://meet.google.com/eval-session',
    status: 'Scheduled'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        role: initialData.role || '',
        studentName: initialData.candidate?.name || '',
        studentRoll: initialData.candidate?.rollNo || '',
        studentEmail: initialData.candidate?.email || '',
        round: initialData.round || ROUND_OPTIONS[0],
        date: initialData.date || '',
        time: initialData.time || '10:00 AM - 11:00 AM IST',
        mode: initialData.mode || 'Online',
        locationLink: initialData.locationLink || '',
        status: initialData.status || 'Scheduled'
      });
    } else {
      setFormData({
        company: companies[0]?.name || '',
        role: 'Associate Software Engineer',
        studentName: applicants[0]?.student?.name || '',
        studentRoll: applicants[0]?.student?.rollNo || '',
        studentEmail: applicants[0]?.student?.email || '',
        round: ROUND_OPTIONS[1],
        date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        time: '10:00 AM - 11:00 AM IST',
        mode: 'Online',
        locationLink: 'https://meet.google.com/interview-session',
        status: 'Scheduled'
      });
    }
    setError(null);
  }, [initialData, isOpen, companies, applicants]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (e) => {
    const roll = e.target.value;
    const applicant = applicants.find((a) => a.student?.rollNo === roll);
    if (applicant) {
      setFormData((prev) => ({
        ...prev,
        studentName: applicant.student.name,
        studentRoll: applicant.student.rollNo,
        studentEmail: applicant.student.email,
        company: applicant.driveCompany || prev.company,
        role: applicant.driveRole || prev.role
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.studentName || !formData.date) {
      setError('Company, Candidate, and Date are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        company: formData.company,
        role: formData.role,
        round: formData.round,
        date: formData.date,
        time: formData.time,
        mode: formData.mode,
        locationLink: formData.locationLink,
        status: formData.status,
        candidate: {
          name: formData.studentName,
          rollNo: formData.studentRoll,
          email: formData.studentEmail
        }
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Update Interview Session' : 'Schedule Candidate Interview'}
      subtitle="Configure interview evaluation round, candidate, timeline, and location"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Quick select candidate from applicants */}
        {applicants.length > 0 && !isEditing && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Select Shortlisted Candidate
            </label>
            <select
              value={formData.studentRoll}
              onChange={handleStudentSelect}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Candidate...</option>
              {applicants.map((a) => (
                <option key={a.id} value={a.student?.rollNo}>
                  {a.student?.name} ({a.student?.rollNo}) — {a.department} (Match: {a.aiMatchScore}%)
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Candidate Name *
            </label>
            <input
              type="text"
              name="studentName"
              required
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Student Full Name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Roll No / Registration ID
            </label>
            <input
              type="text"
              name="studentRoll"
              value={formData.studentRoll}
              onChange={handleChange}
              placeholder="e.g. 22CS104"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Company *
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. CloudScale Dynamics"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Job Designation / Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Associate Software Engineer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Evaluation Round *
          </label>
          <select
            name="round"
            value={formData.round}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ROUND_OPTIONS.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Interview Date *
            </label>
            <input
              type="text"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              placeholder="YYYY-MM-DD (e.g. 2026-10-25)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Time Slot
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="10:00 AM - 11:00 AM IST"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Interview Mode
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Online">Online / Virtual</option>
              <option value="On-Campus">On-Campus / In-Person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Meeting Link or Venue Details *
          </label>
          <input
            type="text"
            name="locationLink"
            required
            value={formData.locationLink}
            onChange={handleChange}
            placeholder="e.g. https://meet.google.com/... or Campus Block 4, Room 201"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {isEditing ? 'Save Interview' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
