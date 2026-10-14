const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const Screening = require('../models/Screening');
const InterviewRound = require('../models/InterviewRound');
const studentServiceClient = require('../clients/studentServiceClient');

/**
 * Return placement overview metrics for frontend dashboards.
 *
 * Metrics:
 *   - totalCompanies
 *   - totalDrives
 *   - totalApplications
 *   - shortlisted
 *   - interviewed
 *   - selected
 *
 * @returns {Promise<object>} Clean overview JSON
 */
const getOverview = async () => {
  // 1. Placement DB counts
  const totalCompanies = await Company.countDocuments();
  const totalDrives = await PlacementDrive.countDocuments();

  // 2. Total applications: fetch from Student Service REST API or fallback to unique IDs
  let totalApplications = 0;
  const appStats = await studentServiceClient.getApplicationStats();
  if (appStats && typeof appStats.count === 'number' && appStats.count > 0) {
    totalApplications = appStats.count;
  } else {
    const screeningApps = await Screening.distinct('applicationId');
    const interviewApps = await InterviewRound.distinct('applicationId');
    totalApplications = new Set([...screeningApps, ...interviewApps]).size;
  }

  // 3. Candidates shortlisted
  const shortlistedScreenings = await Screening.distinct('applicationId', { decision: 'SHORTLISTED' });
  const shortlistedInterviews = await InterviewRound.distinct('applicationId', { decision: 'SHORTLISTED' });
  const shortlisted = new Set([...shortlistedScreenings, ...shortlistedInterviews]).size;

  // 4. Candidates interviewed
  const interviewedApps = await InterviewRound.distinct('applicationId');
  const interviewed = interviewedApps.length;

  // 5. Candidates selected
  const selectedScreenings = await Screening.distinct('applicationId', { decision: 'SELECTED' });
  const selectedInterviews = await InterviewRound.distinct('applicationId', { decision: 'SELECTED' });
  let selected = new Set([...selectedScreenings, ...selectedInterviews]).size;

  // Cross-reference with Student Service placement records if available
  const placements = await studentServiceClient.getPlacementsStats();
  if (Array.isArray(placements) && placements.length > selected) {
    selected = placements.length;
  }

  return {
    totalCompanies,
    totalDrives,
    totalApplications,
    shortlisted,
    interviewed,
    selected,
  };
};

/**
 * Return company-level analytics for recruitment insights.
 *
 * @returns {Promise<Array>} List of companies with drive & candidate metrics
 */
const getCompanyAnalytics = async () => {
  const companies = await Company.find().sort({ name: 1 });

  const analytics = await Promise.all(
    companies.map(async (company) => {
      const drives = await PlacementDrive.find({ companyId: company._id });
      const driveIds = drives.map((d) => d._id);

      const screenings = await Screening.find({ driveId: { $in: driveIds } });
      const interviews = await InterviewRound.find({ driveId: { $in: driveIds } });

      const allApps = new Set([
        ...screenings.map((s) => s.applicationId),
        ...interviews.map((i) => i.applicationId),
      ]);

      const shortlistedApps = new Set([
        ...screenings.filter((s) => s.decision === 'SHORTLISTED').map((s) => s.applicationId),
        ...interviews.filter((i) => i.decision === 'SHORTLISTED').map((i) => i.applicationId),
      ]);

      const interviewedApps = new Set(interviews.map((i) => i.applicationId));

      const selectedApps = new Set([
        ...screenings.filter((s) => s.decision === 'SELECTED').map((s) => s.applicationId),
        ...interviews.filter((i) => i.decision === 'SELECTED').map((i) => i.applicationId),
      ]);

      return {
        companyId: company._id,
        name: company.name,
        industry: company.industry,
        location: company.location,
        drivesCount: drives.length,
        totalApplications: allApps.size,
        shortlisted: shortlistedApps.size,
        interviewed: interviewedApps.size,
        selected: selectedApps.size,
      };
    })
  );

  return analytics;
};

/**
 * Return department-level placement analytics.
 * Enriches department data via Student Service REST APIs without accessing Student DB.
 *
 * @returns {Promise<Array>} Department-wise placement metrics
 */
const getDepartmentAnalytics = async () => {
  const drives = await PlacementDrive.find();
  const deptMap = {};

  // 1. Populate departments from drive eligibility criteria
  for (const drive of drives) {
    const eligibleDepts = drive.eligibility?.eligibleDepartments || [];
    for (const rawDept of eligibleDepts) {
      const dept = String(rawDept).trim().toUpperCase();
      if (!deptMap[dept]) {
        deptMap[dept] = {
          department: dept,
          eligibleDrives: 0,
          totalApplications: 0,
          shortlisted: 0,
          selected: 0,
        };
      }
      deptMap[dept].eligibleDrives += 1;
    }
  }

  // 2. Fetch screening records and correlate student department over REST
  const screenings = await Screening.find();
  const studentCache = new Map();

  for (const screening of screenings) {
    let student = studentCache.get(screening.studentId);
    if (!student) {
      try {
        student = await studentServiceClient.getStudentById(screening.studentId);
        if (student) studentCache.set(screening.studentId, student);
      } catch (_) {
        // Fallback if student details are not found
      }
    }

    const rawDept = student?.department || student?.branch;
    if (rawDept) {
      const dept = String(rawDept).trim().toUpperCase();
      if (!deptMap[dept]) {
        deptMap[dept] = {
          department: dept,
          eligibleDrives: 0,
          totalApplications: 0,
          shortlisted: 0,
          selected: 0,
        };
      }

      deptMap[dept].totalApplications += 1;
      if (screening.decision === 'SHORTLISTED') {
        deptMap[dept].shortlisted += 1;
      } else if (screening.decision === 'SELECTED') {
        deptMap[dept].selected += 1;
      }
    }
  }

  // Fallback defaults if no drives or screenings exist
  const result = Object.values(deptMap);
  if (result.length === 0) {
    const defaultDepts = ['CSE', 'IT', 'ECE', 'MECH', 'EEE'];
    return defaultDepts.map((department) => ({
      department,
      eligibleDrives: 0,
      totalApplications: 0,
      shortlisted: 0,
      selected: 0,
    }));
  }

  return result.sort((a, b) => b.selected - a.selected || a.department.localeCompare(b.department));
};

module.exports = {
  getOverview,
  getCompanyAnalytics,
  getDepartmentAnalytics,
};
