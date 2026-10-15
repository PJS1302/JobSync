/**
 * Skill dictionary mapping canonical skill names to regex patterns and aliases.
 */
const SKILL_DEFINITIONS = [
  // Programming Languages
  { name: 'Python', patterns: [/\bpython\b/i] },
  { name: 'JavaScript', patterns: [/\bjavascript\b/i, /\bjs\b/i, /\bes6\b/i] },
  { name: 'TypeScript', patterns: [/\btypescript\b/i, /\bts\b/i] },
  { name: 'Java', patterns: [/\bjava\b(?!script)/i] },
  { name: 'C++', patterns: [/\bc\+\+\b/i, /\bcpp\b/i] },
  { name: 'C#', patterns: [/\bc#\b/i, /\bcsharp\b/i] },
  { name: 'C', patterns: [/\bc\b(?!\+\+|#)/i] },
  { name: 'Go', patterns: [/\bgolang\b/i, /\bgo\b(?=\s*(developer|programming|code))/i] },
  { name: 'Rust', patterns: [/\brust\b/i] },
  { name: 'Ruby', patterns: [/\bruby\b/i] },
  { name: 'PHP', patterns: [/\bphp\b/i] },
  { name: 'Swift', patterns: [/\bswift\b/i] },
  { name: 'Kotlin', patterns: [/\bkotlin\b/i] },
  { name: 'SQL', patterns: [/\bsql\b/i, /\brdbms\b/i] },
  { name: 'HTML', patterns: [/\bhtml5?\b/i] },
  { name: 'CSS', patterns: [/\bcss3?\b/i, /\btailwind(css)?\b/i] },

  // Frameworks & Libraries
  { name: 'React', patterns: [/\breact(\.?js)?\b/i, /\breact-dom\b/i] },
  { name: 'Node.js', patterns: [/\bnode(\.?js)?\b/i, /\bnode\b/i] },
  { name: 'Express', patterns: [/\bexpress(\.?js)?\b/i] },
  { name: 'Angular', patterns: [/\bangular(\.?js)?\b/i] },
  { name: 'Vue.js', patterns: [/\bvue(\.?js)?\b/i] },
  { name: 'Next.js', patterns: [/\bnext(\.?js)?\b/i] },
  { name: 'Django', patterns: [/\bdjango\b/i] },
  { name: 'Flask', patterns: [/\bflask\b/i] },
  { name: 'Spring Boot', patterns: [/\bspring\s*boot\b/i, /\bspring\b/i] },
  { name: 'FastAPI', patterns: [/\bfastapi\b/i] },

  // Databases & Caches
  { name: 'MongoDB', patterns: [/\bmongodb\b/i, /\bmongo\b/i, /\bmongoose\b/i] },
  { name: 'PostgreSQL', patterns: [/\bpostgres(ql)?\b/i] },
  { name: 'MySQL', patterns: [/\bmysql\b/i] },
  { name: 'Redis', patterns: [/\bredis\b/i] },
  { name: 'SQLite', patterns: [/\bsqlite\b/i] },
  { name: 'Oracle', patterns: [/\boracle\b/i] },
  { name: 'Cassandra', patterns: [/\bcassandra\b/i] },

  // Cloud & DevOps & Tools
  { name: 'Docker', patterns: [/\bdocker\b/i, /\bcontainer(s|ization)?\b/i] },
  { name: 'Kubernetes', patterns: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { name: 'AWS', patterns: [/\baws\b/i, /\bamazon\s+web\s+services\b/i, /\bec2\b/i, /\bs3\b/i] },
  { name: 'Azure', patterns: [/\bazure\b/i] },
  { name: 'GCP', patterns: [/\bgcp\b/i, /\bgoogle\s+cloud\b/i] },
  { name: 'Git', patterns: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i] },
  { name: 'CI/CD', patterns: [/\bci\/?cd\b/i, /\bpipeline\b/i] },
  { name: 'Linux', patterns: [/\blinux\b/i, /\bunix\b/i, /\bbash\b/i] },
  { name: 'Jenkins', patterns: [/\bjenkins\b/i] },
  { name: 'Terraform', patterns: [/\bterraform\b/i] },

  // Architecture & APIs
  { name: 'REST APIs', patterns: [/\brest(ful)?\s*(api|apis|services)?\b/i, /\bapi\s*(development|integration)\b/i] },
  { name: 'GraphQL', patterns: [/\bgraphql\b/i] },
  { name: 'Microservices', patterns: [/\bmicroservices?\b/i, /\bservice\s*oriented\b/i] },
  { name: 'Software Engineering', patterns: [/\bsoftware\b/i, /\bdcs\b/i, /\bm\.?sc\b/i, /\bcomputer\s*science\b/i, /\bengineering\b/i] },

  // AI & Data Science
  { name: 'Machine Learning', patterns: [/\bmachine\s+learning\b/i, /\bml\b/i] },
  { name: 'Deep Learning', patterns: [/\bdeep\s+learning\b/i] },
  { name: 'PyTorch', patterns: [/\bpytorch\b/i] },
  { name: 'TensorFlow', patterns: [/\btensorflow\b/i] },
  { name: 'Pandas', patterns: [/\bpandas\b/i] },
  { name: 'NumPy', patterns: [/\bnumpy\b/i] },
];

/**
 * Extract matched canonical skills from freeform text.
 * @param {string} text
 * @returns {string[]} Sorted array of unique canonical skills
 */
const extractSkills = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const foundSkills = new Set();

  for (const skill of SKILL_DEFINITIONS) {
    for (const pattern of skill.patterns) {
      if (pattern.test(text)) {
        foundSkills.add(skill.name);
        break;
      }
    }
  }

  return Array.from(foundSkills).sort((a, b) => a.localeCompare(b));
};

module.exports = {
  extractSkills,
  SKILL_DEFINITIONS,
};
