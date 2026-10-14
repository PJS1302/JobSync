/**
 * Analyze skill gaps between candidate skills and required job skills.
 *
 * @param {string[]} candidateSkills - Skills possessed by the candidate
 * @param {string[]} requiredSkills - Skills required by the job
 * @returns {{ matchedSkills: string[], missingSkills: string[], additionalSkills: string[] }}
 */
const analyzeSkillGap = (candidateSkills = [], requiredSkills = []) => {
  const normCandidates = (candidateSkills || []).map((s) => ({
    original: s,
    lower: String(s).trim().toLowerCase(),
  }));

  const normRequired = (requiredSkills || []).map((s) => ({
    original: s,
    lower: String(s).trim().toLowerCase(),
  }));

  const matchedSkillsSet = new Set();
  const missingSkillsSet = new Set();
  const matchedCandidateLower = new Set();

  for (const req of normRequired) {
    if (!req.lower) continue;
    const found = normCandidates.find((c) => c.lower === req.lower);
    if (found) {
      matchedSkillsSet.add(req.original);
      matchedCandidateLower.add(found.lower);
    } else {
      missingSkillsSet.add(req.original);
    }
  }

  const additionalSkills = normCandidates
    .filter((c) => !matchedCandidateLower.has(c.lower))
    .map((c) => c.original);

  return {
    matchedSkills: Array.from(matchedSkillsSet),
    missingSkills: Array.from(missingSkillsSet),
    additionalSkills,
  };
};

module.exports = {
  analyzeSkillGap,
};
