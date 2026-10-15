const aiService = require('../services/aiService');
const { extractSkills: extractSkillsUtil } = require('../ai/skillExtractor');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Handle AI match analysis between a resume and job description.
 * POST /api/ai/match
 */
const matchJob = async (req, res, next) => {
  try {
    const result = await aiService.analyzeResumeAndJob(req.body);
    return sendSuccess(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle direct skill extraction from text.
 * POST /api/ai/extract-skills
 */
const extractSkills = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return sendError(res, 'Text string is required for skill extraction.', 400);
    }
    const skills = extractSkillsUtil(text);
    return sendSuccess(res, { skills }, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching resume AI analysis for the student dashboard.
 * GET /api/v1/ai/analyze-resume
 */
const getResumeAnalysis = async (req, res, next) => {
  try {
    const studentId = req.query.studentId || req.body?.studentId;
    const result = await aiService.getLatestResumeAnalysis(studentId);
    return sendSuccess(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  matchJob,
  extractSkills,
  getResumeAnalysis,
};

