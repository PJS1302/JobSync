const placementService = require('../services/placementService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Handle recording a student placement result.
 * POST /api/placements
 */
const createPlacement = async (req, res, next) => {
  try {
    const placement = await placementService.createPlacement(req.body);
    return sendSuccess(res, placement, 201);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching all placement records for a student.
 * GET /api/placements/student/:studentId
 */
const getPlacementsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const placements = await placementService.getPlacementsByStudent(studentId);
    return sendSuccess(res, placements, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching a placement record by ID.
 * GET /api/placements/:id
 */
const getPlacementById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const placement = await placementService.getPlacementById(id);

    if (!placement) {
      return sendError(res, 'Placement record not found', 404);
    }

    return sendSuccess(res, placement, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching all placement records.
 * GET /api/placements
 */
const getAllPlacements = async (req, res, next) => {
  try {
    const placements = await placementService.getAllPlacements();
    return sendSuccess(res, placements, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createPlacement,
  getAllPlacements,
  getPlacementsByStudent,
  getPlacementById,
};
