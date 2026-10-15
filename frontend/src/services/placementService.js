import { placementApiClient } from './api';

const STORAGE_KEYS = {
  COMPANIES: 'jobsync_admin_companies',
  DRIVES: 'jobsync_admin_drives',
  APPLICANTS: 'jobsync_admin_applicants',
  INTERVIEWS: 'jobsync_admin_interviews'
};

const INITIAL_COMPANIES = [
  {
    id: 'cmp-01',
    name: 'CloudScale Dynamics',
    industry: 'Cloud Infrastructure & SaaS',
    location: 'Bengaluru, Karnataka',
    website: 'https://cloudscaledynamics.example.com',
    contactPerson: 'Aditi Varma (Lead Campus Recruiter)',
    contactEmail: 'campus@cloudscaledynamics.example.com',
    tier: 'Tier 1 / Dream',
    activeDrivesCount: 1,
    status: 'Active Partner'
  },
  {
    id: 'cmp-02',
    name: 'QuantumFin Tech',
    industry: 'Quantitative Finance & Algorithmic Trading',
    location: 'Hyderabad, Telangana',
    website: 'https://quantumfin.example.com',
    contactPerson: 'Siddharth Rao (VP University Talent)',
    contactEmail: 'talent@quantumfin.example.com',
    tier: 'Tier 1 / Super Dream',
    activeDrivesCount: 1,
    status: 'Active Partner'
  },
  {
    id: 'cmp-03',
    name: 'Acuity Systems',
    industry: 'Enterprise Observability & DevTools',
    location: 'Pune, Maharashtra',
    website: 'https://acuitysystems.example.com',
    contactPerson: 'Meera Nambiar (Technical Recruiter)',
    contactEmail: 'hiring@acuitysystems.example.com',
    tier: 'Tier 2 / Core',
    activeDrivesCount: 1,
    status: 'Active Partner'
  },
  {
    id: 'cmp-04',
    name: 'Nova Robotics & IoT',
    industry: 'Autonomous Robotics & Embedded Systems',
    location: 'Chennai, Tamil Nadu',
    website: 'https://novarobotics.example.com',
    contactPerson: 'Karthik Raja (Director of Engineering)',
    contactEmail: 'careers@novarobotics.example.com',
    tier: 'Tier 2 / Specialized',
    activeDrivesCount: 1,
    status: 'Active Partner'
  },
  {
    id: 'cmp-05',
    name: 'Apex Cloud Infrastructure',
    industry: 'Cloud Security & DevOps',
    location: 'Mumbai, Maharashtra',
    website: 'https://apexcloud.example.com',
    contactPerson: 'Rajesh Deshmukh (HR Manager)',
    contactEmail: 'recruiting@apexcloud.example.com',
    tier: 'Tier 1 / Dream',
    activeDrivesCount: 1,
    status: 'Active Partner'
  }
];

const INITIAL_DRIVES = [
  {
    id: 'drv-01',
    company: 'CloudScale Dynamics',
    companyId: 'cmp-01',
    role: 'Associate Software Engineer',
    description:
      'Design and build scalable cloud microservices, automate distributed workflows, and build resilient backend components with Node.js and cloud infrastructure.',
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
    status: 'published'
  },
  {
    id: 'drv-02',
    company: 'QuantumFin Tech',
    companyId: 'cmp-02',
    role: 'Full Stack Developer',
    description:
      'Join our quantitative engineering squad building high-throughput algorithmic trading platforms and real-time transaction microservices.',
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
    status: 'published'
  },
  {
    id: 'drv-03',
    company: 'Acuity Systems',
    companyId: 'cmp-03',
    role: 'Frontend Engineer (React)',
    description:
      'Build sleek, accessible, high-performance web dashboards and design systems for enterprise observability.',
    package: '₹12 - 15 LPA',
    location: 'Pune / Remote',
    requiredSkills: ['React', 'JavaScript', 'CSS3', 'Tailwind CSS', 'Web Performance'],
    eligibility: {
      minCgpa: 7.5,
      departments: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering'],
      maxBacklogs: 1,
      graduationYear: 2027,
      criteriaNote: 'Minimum 7.5 CGPA. Maximum 1 active backlog permitted.'
    },
    deadline: '2026-10-28',
    category: 'Core',
    status: 'published'
  },
  {
    id: 'drv-04',
    company: 'Nova Robotics & IoT',
    companyId: 'cmp-04',
    role: 'Embedded Software Engineer',
    description:
      'Firmware development, sensor telemetry integration, and low-latency robotics control systems.',
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
    status: 'published'
  },
  {
    id: 'drv-05',
    company: 'Apex Cloud Infrastructure',
    companyId: 'cmp-05',
    role: 'DevOps & Site Reliability Engineer',
    description:
      'Manage multi-region Kubernetes clusters, CI/CD automated deployment pipelines, and zero-downtime infrastructure operations.',
    package: '₹16 - 20 LPA',
    location: 'Mumbai / Hybrid',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS / GCP', 'Python / Bash'],
    eligibility: {
      minCgpa: 7.8,
      departments: ['Computer Science & Engineering', 'Information Technology'],
      maxBacklogs: 0,
      graduationYear: 2027,
      criteriaNote: 'Minimum 7.8 CGPA. Linux and cloud experience preferred.'
    },
    deadline: '2026-11-05',
    category: 'Dream',
    status: 'closed'
  }
];

const INITIAL_APPLICANTS = [
  {
    id: 'app-01',
    student: {
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      rollNo: '22CS104'
    },
    department: 'Computer Science & Engineering',
    cgpa: 8.92,
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Tailwind CSS'],
    aiMatchScore: 94,
    applicationStatus: 'Shortlisted',
    driveId: 'drv-01',
    driveCompany: 'CloudScale Dynamics',
    driveRole: 'Associate Software Engineer',
    appliedAt: '2026-10-10'
  },
  {
    id: 'app-02',
    student: {
      name: 'Priya Sharma',
      email: 'priya.sharma@university.edu',
      rollNo: '22IT045'
    },
    department: 'Information Technology',
    cgpa: 9.15,
    skills: ['TypeScript', 'React', 'Python', 'Docker', 'PostgreSQL', 'GraphQL'],
    aiMatchScore: 91,
    applicationStatus: 'Shortlisted',
    driveId: 'drv-02',
    driveCompany: 'QuantumFin Tech',
    driveRole: 'Full Stack Developer',
    appliedAt: '2026-10-11'
  },
  {
    id: 'app-03',
    student: {
      name: 'Rohan Verma',
      email: 'rohan.verma@university.edu',
      rollNo: '22CS088'
    },
    department: 'Computer Science & Engineering',
    cgpa: 7.85,
    skills: ['JavaScript', 'HTML5', 'CSS3', 'React', 'Redux', 'Git'],
    aiMatchScore: 86,
    applicationStatus: 'Applied',
    driveId: 'drv-03',
    driveCompany: 'Acuity Systems',
    driveRole: 'Frontend Engineer (React)',
    appliedAt: '2026-10-12'
  },
  {
    id: 'app-04',
    student: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@university.edu',
      rollNo: '22EC032'
    },
    department: 'Electronics & Communication Engineering',
    cgpa: 8.95,
    skills: ['C++', 'Embedded C', 'RTOS', 'ARM Cortex', 'I2C/SPI', 'Linux'],
    aiMatchScore: 92,
    applicationStatus: 'Interview',
    driveId: 'drv-04',
    driveCompany: 'Nova Robotics & IoT',
    driveRole: 'Embedded Software Engineer',
    appliedAt: '2026-10-09'
  },
  {
    id: 'app-05',
    student: {
      name: 'Vikram Joshi',
      email: 'vikram.joshi@university.edu',
      rollNo: '22CS142'
    },
    department: 'Computer Science & Engineering',
    cgpa: 8.45,
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Kubernetes'],
    aiMatchScore: 88,
    applicationStatus: 'Selected',
    driveId: 'drv-01',
    driveCompany: 'CloudScale Dynamics',
    driveRole: 'Associate Software Engineer',
    appliedAt: '2026-10-08'
  },
  {
    id: 'app-06',
    student: {
      name: 'Kavita Nair',
      email: 'kavita.nair@university.edu',
      rollNo: '22IT019'
    },
    department: 'Information Technology',
    cgpa: 7.12,
    skills: ['Java', 'SQL', 'PHP', 'HTML'],
    aiMatchScore: 62,
    applicationStatus: 'Rejected',
    driveId: 'drv-02',
    driveCompany: 'QuantumFin Tech',
    driveRole: 'Full Stack Developer',
    appliedAt: '2026-10-10'
  },
  {
    id: 'app-07',
    student: {
      name: 'Siddharth Menon',
      email: 'siddharth.menon@university.edu',
      rollNo: '22DS015'
    },
    department: 'Data Science & Artificial Intelligence',
    cgpa: 8.78,
    skills: ['Python', 'PyTorch', 'SQL', 'FastAPI', 'Pandas', 'Docker'],
    aiMatchScore: 89,
    applicationStatus: 'Applied',
    driveId: 'drv-01',
    driveCompany: 'CloudScale Dynamics',
    driveRole: 'Associate Software Engineer',
    appliedAt: '2026-10-13'
  }
];

const INITIAL_INTERVIEWS = [
  {
    id: 'int-01',
    company: 'CloudScale Dynamics',
    role: 'Associate Software Engineer',
    round: 'Technical Round 1 (System Architecture & DSA)',
    date: '2026-10-18',
    time: '10:00 AM - 11:00 AM IST',
    mode: 'Online',
    locationLink: 'https://meet.google.com/csd-tech-eval-01',
    status: 'Scheduled',
    driveId: 'drv-01',
    candidate: {
      name: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      rollNo: '22CS104'
    }
  },
  {
    id: 'int-02',
    company: 'QuantumFin Tech',
    role: 'Full Stack Developer',
    round: 'Aptitude & Coding Assessment',
    date: '2026-10-15',
    time: '02:00 PM - 03:30 PM IST',
    mode: 'Online',
    locationLink: 'https://app.codesignal.com/eval/qfin-2026-live',
    status: 'Scheduled',
    driveId: 'drv-02',
    candidate: {
      name: 'Priya Sharma',
      email: 'priya.sharma@university.edu',
      rollNo: '22IT045'
    }
  },
  {
    id: 'int-03',
    company: 'Nova Robotics & IoT',
    role: 'Embedded Software Engineer',
    round: 'Hands-on Firmware Hardware Evaluation',
    date: '2026-10-19',
    time: '11:30 AM - 01:00 PM IST',
    mode: 'On-Campus',
    locationLink: 'Robotics Lab 3, Advanced Engineering Block',
    status: 'Scheduled',
    driveId: 'drv-04',
    candidate: {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@university.edu',
      rollNo: '22EC032'
    }
  },
  {
    id: 'int-04',
    company: 'CloudScale Dynamics',
    role: 'Associate Software Engineer',
    round: 'HR & Cultural Alignment Discussion',
    date: '2026-10-12',
    time: '04:00 PM - 04:45 PM IST',
    mode: 'Online',
    locationLink: 'https://meet.google.com/csd-hr-eval-final',
    status: 'Completed',
    driveId: 'drv-01',
    candidate: {
      name: 'Vikram Joshi',
      email: 'vikram.joshi@university.edu',
      rollNo: '22CS142'
    }
  }
];

// Helper to get from local storage or initialize
function getStored(key, initialData) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

// Helper to set into local storage
function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

// ==========================================
// COMPANIES API
// ==========================================

export async function getCompanies() {
  try {
    const res = await placementApiClient.get('/api/v1/companies');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setStored(STORAGE_KEYS.COMPANIES, res.data);
      return { success: true, data: res.data, isLive: true };
    }
  } catch (err) {
    // Backend offline / in progress
  }
  const companies = getStored(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  return { success: true, data: companies, isLive: false };
}

export async function createCompany(companyData) {
  const newCompany = {
    id: `cmp-${Date.now().toString(36)}`,
    activeDrivesCount: 0,
    status: 'Active Partner',
    ...companyData
  };

  try {
    const res = await placementApiClient.post('/api/v1/companies', newCompany);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const companies = getStored(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  const updated = [newCompany, ...companies];
  setStored(STORAGE_KEYS.COMPANIES, updated);
  return { success: true, data: newCompany };
}

export async function updateCompany(id, companyData) {
  try {
    const res = await placementApiClient.put(`/api/v1/companies/${id}`, companyData);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const companies = getStored(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  const updated = companies.map((c) => (c.id === id ? { ...c, ...companyData } : c));
  setStored(STORAGE_KEYS.COMPANIES, updated);
  return { success: true, data: updated.find((c) => c.id === id) };
}

export async function deleteCompany(id) {
  try {
    const res = await placementApiClient.delete(`/api/v1/companies/${id}`);
    if (res.success) {
      return { success: true };
    }
  } catch (err) {
    // Fallback
  }

  const companies = getStored(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  const updated = companies.filter((c) => c.id !== id);
  setStored(STORAGE_KEYS.COMPANIES, updated);
  return { success: true };
}

// ==========================================
// DRIVES API
// ==========================================

export async function getPlacementDrives() {
  try {
    const res = await placementApiClient.get('/api/v1/drives');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setStored(STORAGE_KEYS.DRIVES, res.data);
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Fallback
  }
  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  return { success: true, data: drives, isLive: false };
}

export async function getDriveById(driveId) {
  try {
    const res = await placementApiClient.get(`/api/v1/drives/${driveId}`);
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Fallback
  }
  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  const drive = drives.find((d) => d.id === driveId);
  if (drive) {
    return { success: true, data: drive, isLive: false };
  }
  return { success: false, message: 'Drive not found' };
}

export async function createDrive(driveData) {
  const newDrive = {
    id: `drv-${Date.now().toString(36)}`,
    status: 'published',
    category: driveData.category || 'Core',
    requiredSkills: Array.isArray(driveData.requiredSkills)
      ? driveData.requiredSkills
      : (driveData.requiredSkills || '').split(',').map((s) => s.trim()).filter(Boolean),
    eligibility: {
      minCgpa: parseFloat(driveData.minCgpa) || 7.0,
      departments: driveData.departments || ['Computer Science & Engineering', 'Information Technology'],
      maxBacklogs: parseInt(driveData.maxBacklogs, 10) || 0,
      graduationYear: parseInt(driveData.graduationYear, 10) || 2027,
      criteriaNote: driveData.criteriaNote || `Minimum ${driveData.minCgpa || 7.0} CGPA.`
    },
    ...driveData
  };

  try {
    const res = await placementApiClient.post('/api/v1/drives', newDrive);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  const updated = [newDrive, ...drives];
  setStored(STORAGE_KEYS.DRIVES, updated);

  // Update company drive count
  const companies = getStored(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  const updatedCompanies = companies.map((c) =>
    c.name === newDrive.company ? { ...c, activeDrivesCount: (c.activeDrivesCount || 0) + 1 } : c
  );
  setStored(STORAGE_KEYS.COMPANIES, updatedCompanies);

  return { success: true, data: newDrive };
}

export async function updateDrive(id, driveData) {
  try {
    const res = await placementApiClient.put(`/api/v1/drives/${id}`, driveData);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  const updated = drives.map((d) => (d.id === id ? { ...d, ...driveData } : d));
  setStored(STORAGE_KEYS.DRIVES, updated);
  return { success: true, data: updated.find((d) => d.id === id) };
}

export async function publishDrive(id) {
  try {
    const res = await placementApiClient.patch(`/api/v1/drives/${id}/publish`);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  const updated = drives.map((d) => (d.id === id ? { ...d, status: 'published' } : d));
  setStored(STORAGE_KEYS.DRIVES, updated);
  return { success: true, data: updated.find((d) => d.id === id) };
}

export async function closeDrive(id) {
  try {
    const res = await placementApiClient.patch(`/api/v1/drives/${id}/close`);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  const updated = drives.map((d) => (d.id === id ? { ...d, status: 'closed' } : d));
  setStored(STORAGE_KEYS.DRIVES, updated);
  return { success: true, data: updated.find((d) => d.id === id) };
}

// ==========================================
// APPLICANTS & SCREENING API
// ==========================================

export async function getApplicants(driveId = null) {
  try {
    const url = driveId ? `/api/v1/applicants?driveId=${driveId}` : '/api/v1/applicants';
    const res = await placementApiClient.get(url);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setStored(STORAGE_KEYS.APPLICANTS, res.data);
      return { success: true, data: res.data, isLive: true };
    }
  } catch (err) {
    // Fallback
  }

  let applicants = getStored(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);

  // Synchronize with active student applications and registered student profile
  try {
    const authUserStr = localStorage.getItem('jobsync_auth_user');
    const authUser = authUserStr ? JSON.parse(authUserStr) : null;

    const profileStr = localStorage.getItem('jobsync_student_profile');
    const profile = profileStr ? JSON.parse(profileStr) : null;

    const studentAppsStr = localStorage.getItem('jobsync_student_applications');
    const studentApps = studentAppsStr ? JSON.parse(studentAppsStr) : [];

    const studentName = authUser?.name || profile?.name;
    const studentEmail = authUser?.email || profile?.email;
    const studentDept = authUser?.department || profile?.department || 'Computer Science & Engineering';
    const studentCgpa = authUser?.cgpa || profile?.cgpa || 8.5;

    if (studentName && studentEmail) {
      // If student applied to specific drives, inject them into applicants
      if (Array.isArray(studentApps) && studentApps.length > 0) {
        studentApps.forEach((app) => {
          const alreadyListed = applicants.some(
            (a) => a.id === app.id || (a.driveId === app.driveId && a.student?.email?.toLowerCase() === studentEmail.toLowerCase())
          );
          if (!alreadyListed) {
            applicants.unshift({
              id: app.id || `app-${Date.now()}`,
              student: {
                name: studentName,
                email: studentEmail,
                rollNo: authUser?.rollNo || profile?.rollNo || '22CS104'
              },
              department: studentDept,
              cgpa: studentCgpa,
              skills: profile?.skills || ['React', 'Node.js', 'JavaScript', 'SQL', 'MongoDB'],
              aiMatchScore: 89,
              applicationStatus: app.status === 'shortlisted' ? 'Shortlisted' : (app.status === 'selected' ? 'Selected' : (app.status === 'rejected' ? 'Rejected' : 'Applied')),
              driveId: app.driveId || 'drv-01',
              driveCompany: app.company || 'CloudScale Dynamics',
              driveRole: app.role || 'Associate Software Engineer',
              appliedAt: app.appliedDate || new Date().toISOString().split('T')[0]
            });
          }
        });
      } else {
        // If student is registered but hasn't applied to other drives yet, show their registered profile application
        const alreadyRegistered = applicants.some((a) => a.student?.email?.toLowerCase() === studentEmail.toLowerCase());
        if (!alreadyRegistered) {
          applicants.unshift({
            id: `app-reg-${studentEmail.replace(/[^a-zA-Z0-9]/g, '')}`,
            student: {
              name: studentName,
              email: studentEmail,
              rollNo: authUser?.rollNo || profile?.rollNo || '22CS104'
            },
            department: studentDept,
            cgpa: studentCgpa,
            skills: profile?.skills || ['React', 'Node.js', 'JavaScript', 'MongoDB', 'REST APIs'],
            aiMatchScore: 92,
            applicationStatus: 'Applied',
            driveId: 'drv-01',
            driveCompany: 'CloudScale Dynamics',
            driveRole: 'Associate Software Engineer',
            appliedAt: new Date().toISOString().split('T')[0]
          });
        }
      }
      setStored(STORAGE_KEYS.APPLICANTS, applicants);
    }
  } catch (e) {
    console.error('Failed to sync student application to applicants:', e);
  }

  if (driveId && driveId !== 'ALL') {
    applicants = applicants.filter((a) => a.driveId === driveId);
  }
  return { success: true, data: applicants, isLive: false };
}

export async function shortlistApplicant(id) {
  try {
    await placementApiClient.patch(`/api/v1/applicants/${id}/shortlist`);
  } catch (err) {
    // Fallback
  }

  const applicants = getStored(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
  const targetApplicant = applicants.find((a) => a.id === id);
  const updated = applicants.map((a) => (a.id === id ? { ...a, applicationStatus: 'Shortlisted' } : a));
  setStored(STORAGE_KEYS.APPLICANTS, updated);

  const companyName = targetApplicant?.driveCompany || 'Placement Drive';
  const roleName = targetApplicant?.driveRole || 'Software Engineer';
  const candidateName = targetApplicant?.student?.name || 'Student Candidate';

  // 1. Synchronize to student's applications state
  try {
    const studentAppsRaw = localStorage.getItem('jobsync_student_applications');
    let studentApps = studentAppsRaw ? JSON.parse(studentAppsRaw) : [];
    let appMatched = false;

    studentApps = studentApps.map((app) => {
      const isTarget =
        app.id === id ||
        app.driveId === targetApplicant?.driveId ||
        app.company?.toLowerCase() === companyName.toLowerCase();
      if (isTarget) {
        appMatched = true;
        return {
          ...app,
          status: 'shortlisted',
          currentStage: 'Shortlisted',
          timeline: (app.timeline || []).map((t) => {
            if (t.step === 'Shortlisted') {
              return {
                ...t,
                status: 'completed',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                notes: 'Shortlisted by Placement Officer'
              };
            }
            if (t.step === 'Interview') {
              return { ...t, status: 'current', date: 'Next Round' };
            }
            return t;
          })
        };
      }
      return app;
    });

    if (!appMatched && targetApplicant) {
      studentApps.unshift({
        id: targetApplicant.id,
        driveId: targetApplicant.driveId || 'drv-01',
        company: companyName,
        role: roleName,
        package: '₹18 - 22 LPA',
        location: 'Bengaluru / Hybrid',
        appliedDate: targetApplicant.appliedAt || new Date().toISOString().split('T')[0],
        status: 'shortlisted',
        currentStage: 'Shortlisted',
        timeline: [
          { step: 'Applied', status: 'completed', date: targetApplicant.appliedAt || 'Recent', notes: 'Application logged with placement cell' },
          { step: 'Shortlisted', status: 'completed', date: 'Just now', notes: 'Qualified past screening criteria by Placement Officer' },
          { step: 'Interview', status: 'current', date: 'Next Round', notes: 'Technical Interview scheduled' },
          { step: 'Selected', status: 'upcoming', date: null, notes: 'Final offer release' }
        ]
      });
    }

    localStorage.setItem('jobsync_student_applications', JSON.stringify(studentApps));
  } catch (err) {
    console.error('Failed to sync student application:', err);
  }

  // 2. Add high-priority unread notification for the student
  try {
    const notifsRaw = localStorage.getItem('jobsync_student_notifications');
    let notifs = notifsRaw ? JSON.parse(notifsRaw) : [];
    const newNotif = {
      id: `notif-shortlist-${Date.now()}`,
      type: 'SHORTLISTED',
      title: `⭐ Shortlisted: ${companyName}`,
      message: `Congratulations ${candidateName}! Your profile has been Shortlisted by the Placement Officer for ${roleName} at ${companyName}.`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      link: '/applications'
    };
    notifs = [newNotif, ...notifs];
    localStorage.setItem('jobsync_student_notifications', JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save student notification on shortlist:', err);
  }

  // 3. Automatically schedule next interview round for the student
  try {
    const intsRaw = localStorage.getItem('jobsync_student_interviews');
    let ints = intsRaw ? JSON.parse(intsRaw) : [];
    const existing = ints.find((i) => i.company?.toLowerCase() === companyName.toLowerCase());
    if (!existing) {
      ints.unshift({
        id: `int-${Date.now()}`,
        company: companyName,
        role: roleName,
        round: 'Round 2: Technical & Architectural Interview',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '11:00 AM IST',
        mode: 'Online (Video Conference)',
        locationOrLink: 'https://meet.google.com/jobsync-interview-eval',
        status: 'scheduled',
        interviewer: 'Placement Assessment Board',
        instructions: 'Please be online 5 minutes before time with your code workspace ready.'
      });
      localStorage.setItem('jobsync_student_interviews', JSON.stringify(ints));
    }
  } catch (err) {
    console.error('Failed to schedule interview round:', err);
  }

  try {
    window.dispatchEvent(new Event('jobsync_notification_change'));
    window.dispatchEvent(new Event('storage'));
  } catch {}

  return { success: true, data: updated.find((a) => a.id === id) };
}

export async function rejectApplicant(id) {
  try {
    await placementApiClient.patch(`/api/v1/applicants/${id}/reject`);
  } catch (err) {
    // Fallback
  }

  const applicants = getStored(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
  const targetApplicant = applicants.find((a) => a.id === id);
  const updated = applicants.map((a) => (a.id === id ? { ...a, applicationStatus: 'Rejected' } : a));
  setStored(STORAGE_KEYS.APPLICANTS, updated);

  const companyName = targetApplicant?.driveCompany || 'Placement Drive';
  const roleName = targetApplicant?.driveRole || 'Software Engineer';
  const candidateName = targetApplicant?.student?.name || 'Student Candidate';

  // Synchronize to student's applications
  try {
    const studentAppsRaw = localStorage.getItem('jobsync_student_applications');
    if (studentAppsRaw) {
      let studentApps = JSON.parse(studentAppsRaw);
      studentApps = studentApps.map((app) => {
        if (
          app.id === id ||
          app.driveId === targetApplicant?.driveId ||
          app.company?.toLowerCase() === companyName.toLowerCase()
        ) {
          return {
            ...app,
            status: 'rejected',
            currentStage: 'Application Closed'
          };
        }
        return app;
      });
      localStorage.setItem('jobsync_student_applications', JSON.stringify(studentApps));
    }

    // Add notification
    const notifsRaw = localStorage.getItem('jobsync_student_notifications');
    let notifs = notifsRaw ? JSON.parse(notifsRaw) : [];
    notifs.unshift({
      id: `notif-reject-${Date.now()}`,
      type: 'APPLICATION_UPDATE',
      title: `Application Update: ${companyName}`,
      message: `Dear ${candidateName}, your application for ${roleName} at ${companyName} has concluded for this hiring drive.`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      link: '/applications'
    });
    localStorage.setItem('jobsync_student_notifications', JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to sync rejection notification:', err);
  }

  try {
    window.dispatchEvent(new Event('jobsync_notification_change'));
    window.dispatchEvent(new Event('storage'));
  } catch {}

  return { success: true, data: updated.find((a) => a.id === id) };
}

// ==========================================
// INTERVIEWS API
// ==========================================

export async function getAdminInterviews() {
  try {
    const res = await placementApiClient.get('/api/v1/interviews');
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      setStored(STORAGE_KEYS.INTERVIEWS, res.data);
      return { success: true, data: res.data, isLive: true };
    }
  } catch (err) {
    // Fallback
  }
  const interviews = getStored(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  return { success: true, data: interviews, isLive: false };
}

export async function createInterview(interviewData) {
  const newInterview = {
    id: `int-${Date.now().toString(36)}`,
    status: 'Scheduled',
    ...interviewData
  };

  try {
    const res = await placementApiClient.post('/api/v1/interviews', newInterview);
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const interviews = getStored(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  const updated = [newInterview, ...interviews];
  setStored(STORAGE_KEYS.INTERVIEWS, updated);
  return { success: true, data: newInterview };
}

export async function scheduleInterview(scheduleData) {
  return createInterview(scheduleData);
}

export async function updateInterviewStatus(id, status) {
  try {
    const res = await placementApiClient.patch(`/api/v1/interviews/${id}/status`, { status });
    if (res.success && res.data) {
      return { success: true, data: res.data };
    }
  } catch (err) {
    // Fallback
  }

  const interviews = getStored(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  const updated = interviews.map((i) => (i.id === id ? { ...i, status } : i));
  setStored(STORAGE_KEYS.INTERVIEWS, updated);
  return { success: true, data: updated.find((i) => i.id === id) };
}

// ==========================================
// ANALYTICS API
// ==========================================

export async function getPlacementAnalytics() {
  try {
    const res = await placementApiClient.get('/api/v1/analytics');
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (err) {
    // Fallback
  }

  const companies = getStored(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  const drives = getStored(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  const applicants = getStored(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
  const interviews = getStored(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);

  const shortlistedCount = applicants.filter((a) => a.applicationStatus === 'Shortlisted').length;
  const selectedCount = applicants.filter((a) => a.applicationStatus === 'Selected').length;

  const analytics = {
    companies: companies.length,
    drives: drives.length,
    applications: applicants.length,
    shortlisted: shortlistedCount,
    interviews: interviews.length,
    selected: selectedCount,
    placementRate: applicants.length > 0 ? Math.round((selectedCount / applicants.length) * 100) : 78,
    highestPackage: '₹28.0 LPA',
    averagePackage: '₹17.4 LPA',
    placementStatistics: {
      totalOffers: selectedCount + 24, // aggregate campus level
      activeRecruiters: companies.length,
      averagePlacementRate: '86.4%',
      departmentBreakdown: [
        { dept: 'Computer Science & Engineering', placed: 88, total: 95, percentage: 92.6 },
        { dept: 'Information Technology', placed: 64, total: 72, percentage: 88.8 },
        { dept: 'Electronics & Communication', placed: 52, total: 65, percentage: 80.0 },
        { dept: 'Electrical & Electronics', placed: 38, total: 50, percentage: 76.0 },
        { dept: 'Data Science & AI', placed: 44, total: 48, percentage: 91.6 }
      ],
      funnel: [
        { stage: 'Applications', count: applicants.length * 15, label: 'Submitted' },
        { stage: 'Shortlisted', count: (shortlistedCount + 1) * 12, label: 'Screened Pass' },
        { stage: 'Interviews', count: interviews.length * 10, label: 'Rounds Held' },
        { stage: 'Selected', count: (selectedCount + 1) * 8, label: 'Offers Given' }
      ]
    }
  };

  return { success: true, data: analytics, isLive: false };
}

export default {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getPlacementDrives,
  getDriveById,
  createDrive,
  updateDrive,
  publishDrive,
  closeDrive,
  getApplicants,
  shortlistApplicant,
  rejectApplicant,
  getAdminInterviews,
  createInterview,
  scheduleInterview,
  updateInterviewStatus,
  getPlacementAnalytics
};
