import { placementApiClient } from './api';

const MOCK_DRIVES = [
  {
    id: 'drv-01',
    company: 'CloudScale Dynamics',
    role: 'Associate Software Engineer',
    description:
      'CloudScale Dynamics is seeking enthusiastic Associate Software Engineers to design and build scalable cloud microservices, automate distributed workflows, and build resilient backend components with Node.js and cloud infrastructure.',
    package: '₹18 - 22 LPA',
    location: 'Bengaluru / Hybrid',
    requiredSkills: ['Node.js', 'React', 'MongoDB', 'REST APIs', 'System Design', 'Git'],
    eligibility: {
      minCgpa: 8.0,
      departments: ['Computer Science & Engineering', 'Information Technology', 'Data Science & Artificial Intelligence'],
      maxBacklogs: 0,
      graduationYear: 2027,
      criteriaNote: 'Minimum 8.0 CGPA throughout academic records with 0 active backlogs.'
    },
    deadline: '2026-10-24',
    category: 'Dream',
    status: 'active'
  },
  {
    id: 'drv-02',
    company: 'QuantumFin Tech',
    role: 'Full Stack Developer',
    description:
      'Join our quantitative engineering squad building high-throughput algorithmic trading platforms, real-time portfolio tracking dashboards, and secured financial transaction microservices.',
    package: '₹24 - 28 LPA',
    location: 'Hyderabad',
    requiredSkills: ['TypeScript', 'React', 'Python', 'PostgreSQL', 'Docker', 'Distributed Systems'],
    eligibility: {
      minCgpa: 8.5,
      departments: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
      maxBacklogs: 0,
      graduationYear: 2027,
      criteriaNote: 'Minimum 8.5 CGPA required. Strong foundation in Data Structures and Algorithms.'
    },
    deadline: '2026-10-20',
    category: 'Super Dream',
    status: 'active'
  },
  {
    id: 'drv-03',
    company: 'Acuity Systems',
    role: 'Frontend Engineer (React)',
    description:
      'Acuity Systems is hiring Frontend Engineers to build sleek, accessible, high-performance web dashboards and design systems for enterprise observability and data analytics.',
    package: '₹12 - 15 LPA',
    location: 'Pune / Remote',
    requiredSkills: ['React', 'JavaScript', 'CSS3', 'Tailwind CSS', 'Web Performance'],
    eligibility: {
      minCgpa: 7.5,
      departments: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering'],
      maxBacklogs: 1,
      graduationYear: 2027,
      criteriaNote: 'Minimum 7.5 CGPA. Maximum 1 active backlog permitted at the time of application.'
    },
    deadline: '2026-10-28',
    category: 'Core',
    status: 'active'
  },
  {
    id: 'drv-04',
    company: 'Nova Robotics & IoT',
    role: 'Embedded Software Engineer',
    description:
      'Nova Robotics develops next-generation autonomous industrial automated guided vehicles (AGVs). This role involves firmware development, sensor telemetry integration, and low-latency robotics control systems.',
    package: '₹10 - 13 LPA',
    location: 'Chennai',
    requiredSkills: ['C++', 'Embedded C', 'RTOS', 'Linux', 'Microcontrollers'],
    eligibility: {
      minCgpa: 8.8,
      departments: ['Electronics & Communication Engineering', 'Electrical & Electronics Engineering'],
      maxBacklogs: 0,
      graduationYear: 2027,
      criteriaNote: 'Requires CGPA ≥ 8.8 and degree in ECE or EEE.'
    },
    deadline: '2026-10-30',
    category: 'Specialized',
    status: 'active'
  },
  {
    id: 'drv-05',
    company: 'Apex Cloud Infrastructure',
    role: 'DevOps & Site Reliability Engineer',
    description:
      'Apex is expanding our SRE team to manage multi-region Kubernetes clusters, CI/CD automated deployment pipelines, and zero-downtime infrastructure operations for international clients.',
    package: '₹16 - 20 LPA',
    location: 'Mumbai / Hybrid',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS / GCP', 'Python / Bash'],
    eligibility: {
      minCgpa: 7.8,
      departments: ['Computer Science & Engineering', 'Information Technology'],
      maxBacklogs: 0,
      graduationYear: 2027,
      criteriaNote: 'Minimum 7.8 CGPA. Linux and cloud certification/experience preferred.'
    },
    deadline: '2026-11-05',
    category: 'Dream',
    status: 'active'
  }
];

/**
 * Fetch all placement drives
 */
export async function getPlacementDrives() {
  try {
    const res = await placementApiClient.get('/api/v1/drives');
    if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Service not running or endpoint in progress
  }

  return { success: true, data: MOCK_DRIVES, isLive: false };
}

/**
 * Fetch drive details by drive ID
 */
export async function getDriveById(driveId) {
  try {
    const res = await placementApiClient.get(`/api/v1/drives/${driveId}`);
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Service not running
  }

  const drive = MOCK_DRIVES.find((d) => d.id === driveId);
  if (drive) {
    return { success: true, data: drive, isLive: false };
  }

  return { success: false, message: 'Drive not found' };
}

export default {
  getPlacementDrives,
  getDriveById
};
