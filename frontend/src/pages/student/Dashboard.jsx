import React, { useState, useEffect } from 'react';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getDashboardOverview, applyToDrive } from '../../services/studentService';
import { formatDate, formatDateTime, getDaysRemaining, getRelativeTime } from '../../utils/formatDate';

/**
 * Student Dashboard Module – JobSync Placement Drive Management System
 */
export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driveFilter, setDriveFilter] = useState('all'); // 'all' | 'eligible' | 'dream'
  const [toastMessage, setToastMessage] = useState(null);
  const [appliedDriveIds, setAppliedDriveIds] = useState(new Set());

  // Show transient toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load dashboard overview data
  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getDashboardOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      triggerToast('Error loading dashboard data. Showing local snapshot.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Quick Apply action
  const handleApply = async (drive) => {
    if (appliedDriveIds.has(drive.id)) return;

    const res = await applyToDrive(drive.id);
    if (res.success) {
      setAppliedDriveIds((prev) => new Set([...prev, drive.id]));
      triggerToast(`Application submitted successfully for ${drive.companyName}!`);
    } else {
      triggerToast(res.message || 'Failed to submit application');
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader text="Loading your placement dashboard & drive matches..." size={38} />
      </div>
    );
  }

  const { student, metrics, placementDrives = [], applications = [], interviews = [], notifications = [] } = data || {};

  // Filter placement drives
  const filteredDrives = placementDrives.filter((drive) => {
    if (driveFilter === 'eligible') return drive.isEligible;
    if (driveFilter === 'dream') return drive.category === 'Dream' || drive.category === 'Super Dream';
    return true;
  });

  return (
    <div className="page-wrapper" id="student-dashboard-root">
      {/* Toast alert banner */}
      {toastMessage && (
        <div className="toast-notice" id="dashboard-toast-notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}

      {/* Top Welcome / Profile Header Banner */}
      <section className="welcome-banner" aria-label="Student Overview">
        <div className="welcome-info">
          <h1>Welcome back, {student?.name || 'Candidate'}! 🎓</h1>
          <div className="welcome-meta">
            <span className="welcome-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Roll: <strong>{student?.rollNumber || '22CS104'}</strong>
            </span>
            <span className="welcome-tag">
              Dept: <strong>{student?.department || 'Computer Science'}</strong>
            </span>
            <span className="welcome-tag cgpa-highlight">
              CGPA: <strong>{student?.cgpa || '8.72'} / 10</strong>
            </span>
            <span className="welcome-tag" style={{ color: '#34d399' }}>
              ✓ All Clear (0 Backlogs)
            </span>
          </div>
        </div>

        <div className="welcome-actions">
          <Button
            id="btn-refresh-dashboard"
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            loading={refreshing}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
              </svg>
            }
          >
            Refresh Feed
          </Button>
          <Button
            id="btn-view-resume-match"
            variant="primary"
            size="sm"
            onClick={() => triggerToast(`Current AI Resume Match Score: ${student?.resumeMatchScore || 92}%`)}
          >
            AI Resume: {student?.resumeMatchScore || 92}%
          </Button>
        </div>
      </section>

      {/* 4 Summary Stat Cards */}
      <section className="stats-grid" aria-label="Placement Drive Key Metrics">
        <div className="stat-card" id="card-stat-drives">
          <div className="stat-card-header">
            <span className="stat-title">Active Placement Drives</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#38bdf8' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{metrics?.activeDrivesCount || 14}</div>
          <div className="stat-subtext" style={{ color: '#34d399' }}>
            <span>↑ 3 new posted this week</span>
          </div>
        </div>

        <div className="stat-card" id="card-stat-applications">
          <div className="stat-card-header">
            <span className="stat-title">Submitted Applications</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{metrics?.applicationsSubmittedCount || 5}</div>
          <div className="stat-subtext">
            <span>2 currently under active review</span>
          </div>
        </div>

        <div className="stat-card" id="card-stat-interviews">
          <div className="stat-card-header">
            <span className="stat-title">Scheduled Interviews</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{metrics?.upcomingInterviewsCount || 2}</div>
          <div className="stat-subtext" style={{ color: '#fbbf24' }}>
            <span>Next: Tomorrow @ 10:00 AM</span>
          </div>
        </div>

        <div className="stat-card" id="card-stat-offers">
          <div className="stat-card-header">
            <span className="stat-title">Placement Offers</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{metrics?.offersCount || 1} Offer</div>
          <div className="stat-subtext" style={{ color: '#34d399' }}>
            <span>Dream Tier: {metrics?.dreamOfferPackage || '₹18.5 LPA'}</span>
          </div>
        </div>
      </section>

      {/* Main Dashboard Multi-column Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Drives & Applications Tracking */}
        <div className="dashboard-column">
          {/* Active & Recommended Drives Section */}
          <section className="glass-panel" aria-labelledby="drives-section-title">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2 id="drives-section-title" className="panel-title">Active & Recommended Drives</h2>
                <span className="panel-count">{filteredDrives.length}</span>
              </div>

              {/* Drive Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <Button
                  id="tab-filter-all"
                  variant={driveFilter === 'all' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDriveFilter('all')}
                >
                  All
                </Button>
                <Button
                  id="tab-filter-eligible"
                  variant={driveFilter === 'eligible' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDriveFilter('eligible')}
                >
                  Eligible Only
                </Button>
                <Button
                  id="tab-filter-dream"
                  variant={driveFilter === 'dream' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setDriveFilter('dream')}
                >
                  Dream Tier
                </Button>
              </div>
            </div>

            <div className="drives-list">
              {filteredDrives.map((drive) => {
                const isAlreadyApplied = appliedDriveIds.has(drive.id);
                const deadlineRemaining = getDaysRemaining(drive.deadline);

                return (
                  <article key={drive.id} className="drive-card" id={`drive-card-${drive.id}`}>
                    <div className="drive-card-top">
                      <div className="company-identity">
                        <div className="company-logo-box">{drive.logoChar}</div>
                        <div>
                          <h3 className="role-title">{drive.role}</h3>
                          <div className="company-name">{drive.companyName} • {drive.location}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StatusBadge
                          status={drive.isEligible ? 'eligible' : 'ineligible'}
                          label={drive.isEligible ? 'Eligible' : 'Min CGPA 8.8'}
                        />
                      </div>
                    </div>

                    <div className="drive-tags-row">
                      <span className="meta-pill salary-pill">{drive.ctc}</span>
                      <span className="meta-pill match-score-pill">
                        ⚡ {drive.matchScore}% Skill Match
                      </span>
                      <span className="meta-pill">
                        Category: <strong style={{ color: '#fff', marginLeft: 4 }}>{drive.category}</strong>
                      </span>
                      {drive.requiredSkills?.map((skill) => (
                        <span key={skill} className="meta-pill" style={{ opacity: 0.85 }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="drive-card-footer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Deadline: {formatDate(drive.deadline)} ({deadlineRemaining})</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          id={`btn-apply-${drive.id}`}
                          variant={isAlreadyApplied ? 'outline' : drive.isEligible ? 'primary' : 'outline'}
                          size="sm"
                          disabled={!drive.isEligible || isAlreadyApplied}
                          onClick={() => handleApply(drive)}
                        >
                          {isAlreadyApplied ? 'Applied ✓' : drive.isEligible ? 'Quick Apply' : 'Ineligible'}
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Applications Tracking Section */}
          <section className="glass-panel" aria-labelledby="applications-section-title">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2 id="applications-section-title" className="panel-title">My Application Progress</h2>
                <span className="panel-count">{applications.length} Active</span>
              </div>
            </div>

            <div className="applications-table-wrapper">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Company & Role</th>
                    <th>Applied On</th>
                    <th>Current Stage</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} id={`app-row-${app.id}`}>
                      <td>
                        <div className="app-company-cell">{app.companyName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.role}</div>
                      </td>
                      <td>{formatDate(app.appliedDate)}</td>
                      <td>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{app.stage}</span>
                      </td>
                      <td>
                        <div className="stage-tracker" title={`Stage ${app.stageNumber} of ${app.totalStages}`}>
                          {Array.from({ length: app.totalStages }).map((_, idx) => {
                            const isDone = idx + 1 < app.stageNumber;
                            const isCurr = idx + 1 === app.stageNumber;
                            return (
                              <div
                                key={idx}
                                className={`stage-step ${isDone ? 'completed' : isCurr ? 'current' : ''}`}
                              />
                            );
                          })}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Interviews, AI Insights, Alerts */}
        <div className="dashboard-column">
          {/* Upcoming Interview Schedule Card */}
          <section className="glass-panel" aria-labelledby="interviews-section-title">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2 id="interviews-section-title" className="panel-title">Upcoming Interviews</h2>
                <span className="panel-count">{interviews.length}</span>
              </div>
            </div>

            <div>
              {interviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No upcoming interviews scheduled.</p>
              ) : (
                interviews.map((interview) => (
                  <div key={interview.id} className="interview-card" id={`interview-${interview.id}`}>
                    <div className="interview-header">
                      <div>
                        <div className="interview-company">{interview.companyName}</div>
                        <div className="interview-round-name">{interview.roundTitle}</div>
                      </div>
                      <StatusBadge status={interview.status} />
                    </div>

                    <div className="interview-meta-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{formatDateTime(interview.scheduledTime)}</span>
                    </div>

                    <div className="interview-meta-row" style={{ marginTop: '0.25rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      <span>Platform: <strong style={{ color: '#fff' }}>{interview.platform}</strong></span>
                    </div>

                    {interview.meetingLink && (
                      <div style={{ marginTop: '0.85rem' }}>
                        <Button
                          id={`btn-join-${interview.id}`}
                          variant="primary"
                          size="sm"
                          style={{ width: '100%' }}
                          onClick={() => triggerToast(`Opening interview link: ${interview.meetingLink}`)}
                        >
                          Join Video Call
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* AI Resume & Skill Gap Analysis Widget */}
          <section className="glass-panel" aria-labelledby="ai-insights-title">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2 id="ai-insights-title" className="panel-title">AI Resume Intelligence</h2>
              </div>
            </div>

            <div className="ai-insight-box">
              <div className="ai-score-row">
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Overall Drive Compatibility</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyzed from {student?.resumeName || 'Resume.pdf'}</div>
                </div>
                <div className="ai-score-number">{student?.resumeMatchScore || 92}%</div>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0', marginTop: '0.5rem' }}>
                Extracted High-Demand Skills
              </div>
              <div className="skills-tags-cluster">
                {student?.extractedSkills?.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  💡 <strong>Skill Recommendation:</strong> Adding <em>GraphQL</em> and <em>Kubernetes</em> will increase eligibility for 4 additional dream companies.
                </div>
              </div>
            </div>
          </section>

          {/* In-App Placement Alerts */}
          <section className="glass-panel" aria-labelledby="announcements-title">
            <div className="panel-header">
              <div className="panel-title-group">
                <h2 id="announcements-title" className="panel-title">Placement Cell Notices</h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.8rem', color: '#fff' }}>{notif.title}</strong>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{getRelativeTime(notif.timestamp)}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
