const companyService = require('../services/companyService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/** Required fields for creating a company. */
const REQUIRED_FIELDS = ['name', 'industry', 'contactEmail'];

/**
 * Validate that all required fields are present and non-empty.
 * @param {object} body
 * @returns {string|null} Error message, or null if valid
 */
const validateRequired = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === '') {
      return `${field} is required`;
    }
  }
  return null;
};

/**
 * POST /api/companies
 */
const createCompany = async (req, res, next) => {
  try {
    const validationError = validateRequired(req.body);
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const company = await companyService.createCompany(req.body);
    return sendSuccess(res, { company }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/companies
 */
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies();
    return sendSuccess(res, { companies });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/companies/:id
 */
const getCompanyById = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    return sendSuccess(res, { company });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/companies/:id
 */
const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.updateCompany(req.params.id, req.body);
    return sendSuccess(res, { company });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/companies/:id
 */
const deleteCompany = async (req, res, next) => {
  try {
    await companyService.deleteCompany(req.params.id);
    return sendSuccess(res, { message: 'Company deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
