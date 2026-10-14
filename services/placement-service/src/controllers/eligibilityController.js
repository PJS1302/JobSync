const eligibilityService = require('../services/eligibilityService');
const { sendError } = require('../utils/apiResponse');

/**
 * Check eligibility endpoint controller.
 * Supports:
 *   - { studentId, driveId } (fetches student via REST client and drive from DB)
 *   - { student, rules } or { student, eligibility } (direct rule evaluation)
 *   - { student, driveId } (drive from DB, student passed directly)
 */
const checkEligibilityController = async (req, res, next) => {
  try {
    const studentId = req.body.studentId || req.params.studentId;
    const driveId = req.body.driveId || req.params.driveId;
    const { student, rules, eligibility } = req.body;

    let result;

    if (student && (rules || eligibility)) {
      result = eligibilityService.checkEligibility(student, rules || eligibility);
    } else if (studentId && driveId) {
      result = await eligibilityService.checkStudentEligibility(studentId, driveId);
    } else if (student && driveId) {
      result = await eligibilityService.checkStudentDataAgainstDrive(student, driveId);
    } else {
      return sendError(
        res,
        'Either studentId and driveId, or student and eligibility rules are required',
        400
      );
    }

    return res.status(200).json({
      success: true,
      data: result,
      eligible: result.eligible,
      reasons: result.reasons,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkEligibilityController,
};
