const Company = require('../models/Company');

/**
 * Create a new company.
 * @param {object} data - { name, description, website, location, industry, contactEmail }
 * @returns {Promise<object>} Saved company document
 */
const createCompany = async (data) => {
  const company = new Company(data);
  return await company.save();
};

/**
 * Return all companies.
 * @returns {Promise<Array>}
 */
const getAllCompanies = async () => {
  return await Company.find().sort({ createdAt: -1 });
};

/**
 * Return a single company by its MongoDB _id.
 * @param {string} id
 * @returns {Promise<object>}
 */
const getCompanyById = async (id) => {
  const company = await Company.findById(id);
  if (!company) {
    const err = new Error('Company not found');
    err.statusCode = 404;
    throw err;
  }
  return company;
};

/**
 * Update an existing company by id.
 * @param {string} id
 * @param {object} data - Fields to update
 * @returns {Promise<object>} Updated company document
 */
const updateCompany = async (id, data) => {
  const company = await Company.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query',
  });
  if (!company) {
    const err = new Error('Company not found');
    err.statusCode = 404;
    throw err;
  }
  return company;
};

/**
 * Delete a company by id.
 * @param {string} id
 * @returns {Promise<void>}
 */
const deleteCompany = async (id) => {
  const company = await Company.findByIdAndDelete(id);
  if (!company) {
    const err = new Error('Company not found');
    err.statusCode = 404;
    throw err;
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
