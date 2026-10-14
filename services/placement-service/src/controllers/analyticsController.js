const analyticsService = require('../services/analyticsService');

/**
 * GET /api/analytics/overview
 * Overview metrics: totalCompanies, totalDrives, totalApplications, shortlisted, interviewed, selected.
 */
const getOverview = async (req, res, next) => {
  try {
    const overview = await analyticsService.getOverview();
    return res.status(200).json({
      success: true,
      data: overview,
      ...overview,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/companies
 * Company recruitment statistics.
 */
const getCompanyAnalytics = async (req, res, next) => {
  try {
    const companies = await analyticsService.getCompanyAnalytics();
    return res.status(200).json({
      success: true,
      data: { companies },
      companies,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/departments
 * Department placement metrics.
 */
const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const departments = await analyticsService.getDepartmentAnalytics();
    return res.status(200).json({
      success: true,
      data: { departments },
      departments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOverview,
  getCompanyAnalytics,
  getDepartmentAnalytics,
};
