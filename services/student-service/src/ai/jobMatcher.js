const { analyzeSkillGap } = require('./skillGapAnalyzer');

const PROJECT_KEYWORDS = [
  'project',
  'built',
  'developed',
  'designed',
  'implemented',
  'architected',
  'deployed',
  'system',
  'api',
  'microservices',
  'full-stack',
  'full stack',
  'backend',
  'frontend',
  'database',
  'scalable',
  'performance',
];

/**
 * Assess project relevance based on resume text and match score.
 * @param {string} resumeText
 * @param {string} jobDescription
 * @param {number} matchScore
 * @returns {'High' | 'Medium' | 'Low'}
 */
const calculateProjectRelevance = (resumeText = '', jobDescription = '', matchScore = 0) => {
  const lowerText = `${resumeText} ${jobDescription}`.toLowerCase();
  let keywordHits = 0;

  for (const kw of PROJECT_KEYWORDS) {
    if (lowerText.includes(kw)) {
      keywordHits++;
    }
  }

  if (matchScore >= 70 || keywordHits >= 5) {
    return 'High';
  }
  if (matchScore >= 40 || keywordHits >= 2) {
    return 'Medium';
  }
  return 'Low';
};

/**
 * Match a candidate's resume/skills against a job description.
 *
 * NOTE: AI analysis is strictly advisory. It provides guidance and scoring
 * for human evaluators and must NEVER automatically make SELECTED or REJECTED decisions.
 *
 * @param {Object} params
 * @param {string[]} params.candidateSkills
 * @param {string[]} params.requiredSkills
 * @param {string} [params.resumeText='']
 * @param {string} [params.jobDescription='']
 * @returns {{ matchScore: number, matchedSkills: string[], missingSkills: string[], projectRelevance: string }}
 */
const matchJob = ({
  candidateSkills = [],
  requiredSkills = [],
  resumeText = '',
  jobDescription = '',
}) => {
  const { matchedSkills, missingSkills, additionalSkills } = analyzeSkillGap(
    candidateSkills,
    requiredSkills
  );

  let matchScore = 0;

  if (requiredSkills.length === 0) {
    // If no specific skills required, score is based on candidate skill presence
    matchScore = candidateSkills.length > 0 ? 80 : 50;
  } else if (matchedSkills.length === 0) {
    matchScore = 0;
  } else {
    // Base score from required skill coverage (up to 85 points)
    const coverageRatio = matchedSkills.length / requiredSkills.length;
    let score = coverageRatio * 85;

    // Bonus points for additional relevant candidate skills (up to 15 points)
    const bonus = Math.min(15, additionalSkills.length * 3);
    score += bonus;

    // If 100% of required skills are matched, minimum score is 85
    if (missingSkills.length === 0) {
      score = Math.max(score, 85);
    }

    matchScore = Math.round(Math.min(100, Math.max(0, score)));
  }

  const projectRelevance = calculateProjectRelevance(resumeText, jobDescription, matchScore);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    projectRelevance,
  };
};

module.exports = {
  matchJob,
  calculateProjectRelevance,
};
