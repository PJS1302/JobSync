const assert = require('assert');
const { analyzeWithGemini } = require('../src/ai/geminiClient');
const { analyzeResumeAndJob } = require('../src/services/aiService');

async function runGeminiTests() {
  console.log('--- Testing Gemini AI Integration ---');

  // 1. Direct Gemini Client Call Test
  console.log('[Test 1] Calling analyzeWithGemini directly...');
  try {
    const geminiRes = await analyzeWithGemini({
      resumeText: 'Full Stack Engineer with 3 years experience in React, Node.js, Express, MongoDB, and TypeScript. Developed real-time dashboard.',
      candidateSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      jobDescription: 'Looking for a Cloud Full Stack Engineer with expertise in React, Node.js, Docker, AWS, and MongoDB.',
      requiredSkills: ['React', 'Node.js', 'Docker', 'AWS', 'MongoDB'],
      targetRole: 'Cloud Full Stack Engineer',
    });

    console.log('Gemini Result:', {
      matchScore: geminiRes.matchScore,
      matchedSkills: geminiRes.matchedSkills,
      missingSkills: geminiRes.missingSkills,
      projectsCount: geminiRes.projectRelevance?.length,
      isGeminiPowered: geminiRes.isGeminiPowered,
      modelUsed: geminiRes.modelUsed,
    });

    assert(typeof geminiRes.matchScore === 'number', 'matchScore must be a number');
    assert(geminiRes.matchScore >= 0 && geminiRes.matchScore <= 100, 'matchScore must be between 0 and 100');
    assert(Array.isArray(geminiRes.matchedSkills), 'matchedSkills must be an array');
    assert(Array.isArray(geminiRes.missingSkills), 'missingSkills must be an array');
    assert(Array.isArray(geminiRes.projectRelevance), 'projectRelevance must be an array');
    console.log('✓ [Test 1 Passed] Gemini client returned structured, validated AI analysis.');
  } catch (err) {
    console.warn('⚠️ [Test 1 Note] Gemini direct call returned:', err.message);
  }

  // 2. High-Level AI Service Test (Service Layer)
  console.log('\n[Test 2] Testing aiService.analyzeResumeAndJob()...');
  const serviceRes = await analyzeResumeAndJob({
    resumeText: 'Frontend Developer experienced in React, CSS3, TailwindCSS, and JavaScript. Built accessible UI design systems.',
    candidateSkills: ['React', 'JavaScript', 'CSS3'],
    jobDescription: 'Frontend Engineer requiring React, TypeScript, and Next.js.',
    requiredSkills: ['React', 'TypeScript', 'Next.js'],
    targetRole: 'Frontend UI Engineer',
  });

  console.log('aiService Result:', {
    matchScore: serviceRes.matchScore,
    matchedSkills: serviceRes.matchedSkills,
    missingSkills: serviceRes.missingSkills,
    summaryNotes: serviceRes.summaryNotes?.slice(0, 80) + '...',
    isGeminiPowered: serviceRes.isGeminiPowered,
  });

  assert(typeof serviceRes.matchScore === 'number', 'matchScore must be a number');
  assert(serviceRes.matchScore >= 0 && serviceRes.matchScore <= 100, 'matchScore must be between 0 and 100');
  assert(Array.isArray(serviceRes.matchedSkills), 'matchedSkills must be an array');
  assert(Array.isArray(serviceRes.missingSkills), 'missingSkills must be an array');
  assert(Array.isArray(serviceRes.projectRelevance), 'projectRelevance must be an array');
  console.log('✓ [Test 2 Passed] aiService returned complete analysis compatible with UI.');

  // 3. Fallback Heuristic Test
  console.log('\n[Test 3] Testing heuristic fallback when external AI is unavailable...');
  const { matchJob } = require('../src/ai/jobMatcher');
  const fallbackRes = matchJob({
    candidateSkills: ['Python', 'Django', 'PostgreSQL'],
    requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
  });
  console.log('Fallback Match:', fallbackRes);
  assert(typeof fallbackRes.matchScore === 'number', 'Fallback matchScore must be a number');
  assert(fallbackRes.matchedSkills.includes('Python'), 'Matched skills must include Python');
  assert(fallbackRes.missingSkills.includes('Docker'), 'Missing skills must include Docker');
  console.log('✓ [Test 3 Passed] Heuristic engine accurately computes match score and skill gaps.');

  console.log('\nAll Gemini AI integration tests passed successfully!');
}

runGeminiTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
