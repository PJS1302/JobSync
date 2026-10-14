const fs = require('fs');
const mongoose = require('mongoose');
const { parsePdfFile } = require('../ai/resumeParser');
const { extractSkills } = require('../ai/skillExtractor');
const { matchJob } = require('../ai/jobMatcher');
const Resume = require('../models/Resume');
const Student = require('../models/Student');

/**
 * Perform AI analysis comparing a candidate resume with a job description.
 *
 * Flow:
 * Resume PDF -> Extract text -> Extract skills -> Compare with job description
 * -> Calculate match score -> Find missing skills
 *
 * @param {Object} params
 * @param {string} [params.resumeId]
 * @param {string} [params.studentId]
 * @param {string} [params.resumeText]
 * @param {string} [params.jobDescription]
 * @param {string[]} [params.requiredSkills]
 * @returns {Promise<{ matchScore: number, matchedSkills: string[], missingSkills: string[], projectRelevance: string }>}
 */
const analyzeResumeAndJob = async ({
  resumeId,
  studentId,
  resumeText = '',
  jobDescription = '',
  requiredSkills = [],
}) => {
  let resolvedText = resumeText || '';
  let candidateSkillsSet = new Set();

  // 1. Resolve Resume / Student if provided
  if (resumeId) {
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      const error = new Error('Invalid resume ID format.');
      error.statusCode = 400;
      throw error;
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      const error = new Error('Resume not found.');
      error.statusCode = 404;
      throw error;
    }

    if (!resolvedText) {
      if (resume.filePath && fs.existsSync(resume.filePath)) {
        try {
          resolvedText = await parsePdfFile(resume.filePath);
          resume.extractedText = resolvedText;
          await resume.save();
        } catch {
          resolvedText = resume.extractedText || '';
        }
      } else if (resume.extractedText) {
        resolvedText = resume.extractedText;
      }
    }
  } else if (studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      const error = new Error('Invalid student ID format.');
      error.statusCode = 400;
      throw error;
    }

    const student = await Student.findById(studentId);
    if (!student) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }

    if (Array.isArray(student.skills)) {
      student.skills.forEach((s) => candidateSkillsSet.add(s));
    }

    const resume = await Resume.findOne({ studentId }).sort({ uploadDate: -1, createdAt: -1 });
    if (resume && !resolvedText) {
      if (resume.filePath && fs.existsSync(resume.filePath)) {
        try {
          resolvedText = await parsePdfFile(resume.filePath);
          resume.extractedText = resolvedText;
          await resume.save();
        } catch {
          resolvedText = resume.extractedText || '';
        }
      } else if (resume.extractedText) {
        resolvedText = resume.extractedText;
      }
    }
  }

  // 2. Extract skills from resolved resume text
  if (resolvedText) {
    const extracted = extractSkills(resolvedText);
    extracted.forEach((s) => candidateSkillsSet.add(s));
  }

  const candidateSkills = Array.from(candidateSkillsSet);

  // 3. Resolve required skills from input array or by extracting from jobDescription
  let targetRequiredSkills = [];
  if (Array.isArray(requiredSkills) && requiredSkills.length > 0) {
    targetRequiredSkills = requiredSkills;
  } else if (jobDescription) {
    targetRequiredSkills = extractSkills(jobDescription);
  } else {
    const error = new Error('Job description or required skills must be provided.');
    error.statusCode = 400;
    throw error;
  }

  // 4. Calculate match, skill gap, and relevance
  const result = matchJob({
    candidateSkills,
    requiredSkills: targetRequiredSkills,
    resumeText: resolvedText,
    jobDescription,
  });

  return result;
};

module.exports = {
  analyzeResumeAndJob,
};
