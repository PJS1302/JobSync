# JobSync: Complete Architecture & Module Study Guide 📚

> **Project Name**: JobSync — Intelligent Campus Placement Drive & AI Resume Screening Management System  
> **Architecture**: Polyglot Microservices with React Single Page Application (SPA)  
> **Backend Services**: Student Service (Port 5001), Placement Service (Port 5002)  
> **Frontend**: React 18 + Vite + Tailwind CSS (Port 3000)  
> **Database**: MongoDB Atlas Cloud Clusters (`jobsync_student_db`, `jobsync_placement_db`)  
> **AI Engine**: Google Gemini API (`gemini-flash-latest`) + Heuristic NLP Parser  

---

## Table of Contents
1. [Executive Overview & Problem Statement](#1-executive-overview--problem-statement)
2. [High-Level Architecture & Design Patterns](#2-high-level-architecture--design-patterns)
3. [Module 1: Authentication & Role-Based Access Control (RBAC)](#3-module-1-authentication--role-based-access-control-rbac)
4. [Module 2: Student Management & Profile Engine](#4-module-2-student-management--profile-engine)
5. [Module 3: Placement Drive & Company Management](#5-module-3-placement-drive--company-management)
6. [Module 4: Eligibility Calculation & Automated Screening](#6-module-4-eligibility-calculation--automated-screening)
7. [Module 5: AI Resume Screening & Skill Extraction](#7-module-5-ai-resume-screening--skill-extraction)
8. [Module 6: Interview Pipeline & Notification Subsystem](#8-module-6-interview-pipeline--notification-subsystem)
9. [Module 7: Frontend UI & Single Page Architecture](#9-module-7-frontend-ui--single-page-architecture)
10. [Module 8: DevOps, Containerization & Cloud Deployment](#10-module-8-devops-containerization--cloud-deployment)
11. [Master Summary Comparison Matrix](#11-master-summary-comparison-matrix)
12. [Top 15 Lab Viva & Technical Interview Questions](#12-top-15-lab-viva--technical-interview-questions)

---

## 1. Executive Overview & Problem Statement

### The Problem
Traditional college campus placements rely on fragmented tools:
- **Manual Google Sheets & Forms**: Slow, prone to transcription errors, lack real-time updates.
- **Unverified Academic Records**: Students frequently make typos in their CGPA or active backlogs, causing ineligible candidates to appear in drive lists.
- **Recruiter Bottleneck**: Recruiters spend only **6 to 10 seconds** reviewing a resume. Reading hundreds of PDF resumes manually for each drive causes fatigue, hiring bias, and overlooked talent.
- **Zero Candidate Feedback**: Students receive generic rejection emails without knowing which skills or keywords they lacked.

### The JobSync Solution
JobSync replaces fragmented workflows with a unified, microservice-powered platform:
1. **Verified Student Profiles**: Academic criteria (CGPA, backlogs, department) are standardized in a dedicated student database.
2. **Automated Eligibility Engine**: Candidates are automatically matched against company criteria (min CGPA, allowed departments, zero backlog policies) in real time.
3. **AI Resume Screening**: Uploaded PDF resumes are parsed and evaluated against specific job descriptions using Google Gemini AI, calculating match scores, skill overlaps, missing gaps, and ATS recommendations.
4. **End-to-End Interview Pipeline**: Multi-round scheduling (Technical DSA, System Design, HR) with instant in-app alerts.

---

## 2. High-Level Architecture & Design Patterns

### Architectural Diagram

```
 +-----------------------------------------------------------------------+
 |                     React 18 Single Page App (Vite)                   |
 |    Student Portal  |  Placement Officer Portal  |  Tailwind Dark UI   |
 +-----------------------------------+-----------------------------------+
                                     |
                  Axios HTTP Client (Bearer Auth Token)
                                     |
        +----------------------------+----------------------------+
        |                                                         |
        v :5001                                                   v :5002
 +-----------------------------+           +-----------------------------+
 |       Student Service       |           |      Placement Service      |
 |  - Express.js / Node.js     |           |  - Express.js / Node.js     |
 |  - Auth & Password Hashing  |           |  - Company Management       |
 |  - Student Profiles         |           |  - Drive Publishing         |
 |  - PDF Resume Parsing       |           |  - Eligibility Rules        |
 |  - Gemini AI Evaluation     |           |  - Interview Scheduling     |
 |  - In-App Notifications     |           |  - Placement Analytics      |
 +--------------+--------------+           +--------------+--------------+
                |                                         |
                v                                         v
   +--------------------------+              +--------------------------+
   |  jobsync_student_db      |              |  jobsync_placement_db    |
   |  - users                 |              |  - companies             |
   |  - students              |              |  - drives                |
   |  - applications          |              |  - interviews            |
   |  - resumes               |              +--------------------------+
   |  - notifications         |
   +--------------------------+
                |
                v External HTTPS
     +---------------------+
     | Google Gemini API   |
     | (gemini-flash)      |
     +---------------------+
```

### Core Design Patterns Applied
| Pattern | Where Used | Why Used |
|---|---|---|
| **Database-per-Service** | MongoDB Atlas (`jobsync_student_db`, `jobsync_placement_db`) | Isolates candidate personal data from company placement data, preventing cascading failures. |
| **MVC / Service-Repository** | Both backend services (`routes/` -> `controllers/` -> `services/` -> `models/`) | Keeps HTTP transport separate from business logic and database queries for testability. |
| **Axios Interceptor Pattern** | `frontend/src/services/api.js` | Automatically injects `Bearer <token>` into outgoing requests and standardizes responses into `{ success, data }`. |
| **Strategy / Fallback Pattern** | `services/student-service/src/ai/` | Executes Google Gemini AI primary analysis, automatically falling back to heuristic NLP if quota/network fails. |
| **Context API Provider Pattern** | `frontend/src/context/AuthContext.jsx` | Broadcasts user authentication state, tokens, and role switcher throughout the React component tree. |

---

## 3. Module 1: Authentication & Role-Based Access Control (RBAC)

### 1. What It Is
The security gateway managing registration, login, password encryption, and route protection for two distinct personas: **Students** and **Placement Officers (Admin)**.

### 2. Why It Is Needed
Students should not access administrative capabilities (e.g. creating drives, viewing private company recruiter contacts). Placement Officers need access to candidate pipelines while students need access to their personal applications and resumes.

### 3. What Was Used & How Used
- **Node.js `crypto` Module**:
  - `crypto.randomBytes(16).toString('hex')` generates a unique cryptographically secure salt per user.
  - `crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512')` produces a 512-bit key derivation hash.
  - Passwords are **never stored in plaintext**.
- **Stateless HMAC-SHA256 Token**:
  - Payload format: `${userId}:${role}:${timestamp}`
  - Signature: HMAC-SHA256 hashed with secret key.
  - Base64 encoded and exchanged via HTTP `Authorization: Bearer <token>`.
- **React `ProtectedRoute`**:
  - Wraps routes and checks `user.role === allowedRole`.
  - If a student clicks Placement Officer portal, it immediately redirects to `/login?role=admin` asking for officer credentials.

### 4. How It Performs (Step-by-Step)
1. **Registration**: User submits name, email, password, role.
2. **Backend**:
   - Checks if email exists.
   - Generates salt, computes `passwordHash`.
   - Creates `User` document. If role is `'student'`, automatically creates a corresponding `Student` document.
   - Signs and returns a base64 token.
3. **Frontend**:
   - Stores token in `localStorage.setItem('jobsync_token', token)`.
   - Stores user in `localStorage.setItem('jobsync_auth_user', JSON.stringify(user))`.
4. **Subsequent Requests**: `attachInterceptors` in `api.js` attaches `Authorization: Bearer <token>`.
5. **Backend Middleware**: `authMiddleware.js` decodes base64, finds `User.findById(userId)`, and attaches `req.user`.

### 5. Alternatives & Trade-Offs
| Technology | Pros | Cons | Why JobSync Chose Its Approach |
|---|---|---|---|
| **bcryptjs** | Standard for Node.js | Native dependencies can fail on certain OS builds | Node's built-in `crypto.pbkdf2Sync` requires **zero external dependencies** and is fast and secure. |
| **Server-side Sessions (Redis/Express-session)** | Easy invalidation | Requires stateful cache server (Redis), fails horizontal scaling without sticky sessions | Stateless Bearer token scales horizontally across microservices effortlessly. |
| **OAuth2 / Firebase Auth** | Google 1-click sign in | Relies on third-party vendor, hard to run locally in offline lab environment | Built-in authentication runs standalone anywhere without third-party vendor lock-in. |

---

## 4. Module 2: Student Management & Profile Engine

### 1. What It Is
Manages candidate profiles, academic history, CGPA, graduation year, contact details, active backlogs, and technical skills.

### 2. Why It Is Needed
Placement eligibility hinges on precise criteria: a student with 8.5 CGPA and 0 backlogs is eligible for Tier-1 companies (e.g. Google), whereas an active backlog disqualifies them. Centralizing this data ensures consistency across all applications.

### 3. What Was Used & How Used
- **Mongoose `Student` Model**:
  ```javascript
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    department: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    backlogs: { type: Number, default: 0, min: 0 },
    skills: [String]
  }
  ```
- **Dynamic User Binding**: `getProfile(studentId, req.user)` matches the authenticated user token to their specific student record, preventing the common bug where all users view the first record in the database.
- **Frontend Dual-Layer State**: In `Profile.jsx` and `Dashboard.jsx`, data loads from live API when connected and falls back to cached `localStorage` if offline.

### 4. How It Performs (Step-by-Step)
1. Student navigates to `/profile`.
2. Frontend calls `getStudentProfile(user?.id)`.
3. Backend extracts `req.user` via `authMiddleware.js`.
4. Looks up `Student.findOne({ email: req.user.email })`. If it's a freshly registered user without a profile, it automatically creates one using their registration details.
5. Student edits skills or phone number and clicks "Save Profile" -> HTTP `PUT /api/v1/students/profile`.
6. Database updates and the dashboard reflects changes immediately.

---

## 5. Module 3: Placement Drive & Company Management

### 1. What It Is
A centralized portal for Placement Officers to register recruiting companies and publish job drives with CTC packages, job descriptions, eligibility criteria, and deadlines.

### 2. Why It Is Needed
Placement offices handle dozens of companies simultaneously. Managing drives via email creates confusion on deadlines, venue details, and compensation breakdowns.

### 3. What Was Used & How Used
- **Mongoose `Company` Model**: Stores company name, website, tier (`TIER_1`, `TIER_2`, `STARTUP`), industry, recruiter contacts.
- **Mongoose `Drive` Model**:
  ```javascript
  {
    companyId: { type: ObjectId, ref: 'Company' },
    role: String,
    ctcPackage: String, // e.g. "₹18 - 22 LPA"
    baseSalary: Number,
    location: String,
    deadline: Date,
    status: { type: String, enum: ['ANNOUNCED', 'REGISTRATION_OPEN', 'SHORTLISTING', 'COMPLETED'] },
    eligibilityCriteria: {
      minCgpa: Number,
      maxBacklogs: Number,
      allowedDepartments: [String],
      requiredSkills: [String]
    },
    rounds: [{ roundNumber: Number, name: String, mode: String }]
  }
  ```

### 4. How It Performs (Step-by-Step)
1. Officer opens `/admin/drives` and clicks "Create Drive".
2. Submits company name, CTC, minimum CGPA (e.g. 7.5), allowed departments (CSE, IT, ECE), and required skills (`React`, `Node.js`).
3. Placement service validates fields and saves document with status `'REGISTRATION_OPEN'`.
4. The drive becomes instantly visible in the Student Portal under `/drives`.

---

## 6. Module 4: Eligibility Calculation & Automated Screening

### 1. What It Is
The evaluation engine that automatically validates whether a student qualifies to apply for a placement drive before accepting their application.

### 2. Why It Is Needed
Prevents ineligible students from flooding the recruiter's applicant pool. For example, if Amazon requires a minimum CGPA of 8.0 and no active backlogs, a student with 7.8 or 1 backlog is automatically prevented from applying.

### 3. What Was Used & How Used
- **Screening Rules Algorithm**:
  $$\text{IsEligible} = (\text{CGPA}_{\text{student}} \ge \text{CGPA}_{\text{min}}) \land (\text{Backlogs}_{\text{student}} \le \text{Backlogs}_{\text{max}}) \land (\text{Dept}_{\text{student}} \in \text{Depts}_{\text{allowed}})$$
- **Skill Matching Score**:
  $$\text{SkillMatchRate} = \frac{|\text{Skills}_{\text{candidate}} \cap \text{Skills}_{\text{required}}|}{|\text{Skills}_{\text{required}}|} \times 100$$
- **Mongoose `Application` Model**:
  Tracks student application status: `APPLIED`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`.

### 4. How It Performs (Step-by-Step)
1. Student clicks **"Apply Now"** on a Drive card.
2. Service fetches student profile (CGPA, department, backlogs).
3. Compares against Drive eligibility rules:
   - If `student.cgpa < drive.eligibilityCriteria.minCgpa` -> Returns HTTP 400: *"Your CGPA (7.4) does not meet minimum requirement (8.0)"*.
   - If `student.backlogs > drive.eligibilityCriteria.maxBacklogs` -> Returns HTTP 400: *"Active backlogs exceed maximum allowed (0)"*.
   - If department not in `allowedDepartments` -> Returns HTTP 400.
4. If eligible: Creates `Application` document, increments applicant counter, and dispatches a notification.

---

## 7. Module 5: AI Resume Screening & Skill Extraction

### 1. What It Is
An AI-powered screening module that parses PDF resumes, extracts candidate skills, and leverages Google Gemini AI to analyze candidate suitability against job descriptions.

### 2. Why It Is Needed
Recruiters cannot deeply read hundreds of resumes. JobSync gives both students and recruiters an automated ATS (Applicant Tracking System) score, identified strengths, missing skill gaps, and suggestions for improvement.

### 3. What Was Used & How Used
- **`multer`**: Handles `multipart/form-data` uploads into memory buffer or local disk (`uploads/resumes/`).
- **`pdf-parse`**: Reads raw PDF binary stream and extracts full UTF-8 text contents.
- **Google Gemini API (`gemini-flash-latest`)**:
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`
  - Injected with a strict system prompt instructing Gemini to return **only valid JSON**:
    ```json
    {
      "matchScore": 88,
      "matchedSkills": ["React", "Node.js", "MongoDB", "REST APIs"],
      "missingSkills": ["Docker", "Kubernetes", "AWS"],
      "projectRelevance": [
        { "projectTitle": "E-Commerce App", "relevanceScore": 90, "feedback": "Strong full-stack demonstration" }
      ],
      "summaryNotes": "Candidate demonstrates high competency in MERN development but lacks containerization experience.",
      "isGeminiPowered": true
    }
    ```
- **Heuristic NLP Fallback**:
  - If the Gemini API key is missing, network is offline, or rate limit occurs, JobSync activates `src/ai/jobMatcher.js` and `src/ai/skillExtractor.js`.
  - Uses dictionary-based token matching and Jaccard similarity coefficient to return match scores seamlessly.

---

## 8. Module 6: Interview Pipeline & Notification Subsystem

### 1. What It Is
Coordinates round-by-round interview scheduling (Technical, Coding, HR) and delivers real-time notifications to candidate dashboards.

### 2. Why It Is Needed
Students miss interviews when dates are announced solely on notice boards. JobSync provides a structured schedule view with date, time, meeting link, and room location.

### 3. What Was Used & How Used
- **Mongoose `Interview` Model**:
  ```javascript
  {
    studentId: { type: ObjectId, ref: 'Student' },
    companyId: { type: ObjectId, ref: 'Company' },
    driveId: { type: ObjectId, ref: 'Drive' },
    roundName: String,
    scheduledAt: Date,
    mode: { type: String, enum: ['ONLINE', 'IN_PERSON'] },
    locationOrLink: String,
    status: { type: String, enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'] }
  }
  ```
- **Mongoose `Notification` Model**:
  Stores `title`, `message`, `type` (`DRIVE`, `INTERVIEW`, `APPLICATION`), `read` boolean status, and timestamp.
- **Frontend Notification Bell**: Live unread badge count with one-click "Mark All as Read".

---

## 9. Module 7: Frontend UI & Single Page Architecture

### 1. What It Is
The client-side single page web application built with React 18, Vite, and Tailwind CSS, featuring dark-mode glassmorphism aesthetics.

### 2. Why It Is Needed
A modern placement portal must be intuitive, fast, and responsive across mobile devices and laptops. Fast client-side routing prevents full-page reloads.

### 3. What Was Used & How Used
- **Vite**: Modern frontend build tool offering Instant Hot Module Replacement (HMR) and fast production bundling.
- **React Router v7**: Declarative client-side routing with nested layout wrappers.
- **Tailwind CSS**: Utility-first CSS configured with custom glassmorphism effects (`backdrop-blur-xl`, `bg-slate-900/80`, custom gradient glow borders).

---

## 10. Module 8: DevOps, Containerization & Cloud Deployment

### 1. What It Is
The deployment architecture allowing JobSync to run in both local multi-container environments and production cloud hosting.

### 2. What Was Used & How Used
- **Docker Compose (`docker-compose.yml`)**: Orchestrates multi-container local stack.
- **Render (`render.yaml`)**: Hosts backend microservices with automatic deployment from branch `Draxh`.
- **Vercel (`frontend/vercel.json`)**: Hosts the React Vite frontend with SPA routing rewrites.
- **MongoDB Atlas**: Multi-region cloud replica set database with TLS 1.3 encryption.

---

## 11. Master Summary Comparison Matrix

| Feature / Module | Technology Used | Alternative Considered | Reason for Choice |
|---|---|---|---|
| **Architecture** | Microservices (Student + Placement) | Monolith | Independent scaling, separate databases, failure isolation. |
| **Backend Runtime** | Node.js + Express.js | Python FastAPI / Java Spring Boot | Fast event loop, unified JavaScript across stack, lightweight footprint. |
| **Frontend Framework** | React 18 + Vite | Next.js / Vue.js | Optimal client-side state control with Context API; instant Vite HMR. |
| **Styling** | Tailwind CSS + Glassmorphism | Bootstrap / Material UI | Highly customizable dark theme without heavy component library bloat. |
| **Database** | MongoDB Atlas (NoSQL) | PostgreSQL / MySQL | Flexible schemas for variable interview rounds and skill lists. |
| **Password Encryption**| `crypto.pbkdf2Sync` (Salted) | Plain MD5 / SHA-256 | High iteration count prevents rainbow table attacks; zero npm dependencies. |
| **AI Resume Engine** | Google Gemini 1.5 Flash | OpenAI GPT-4 / Ollama | Sub-second latency, structured JSON mode, generous academic tier. |
| **PDF Extraction** | `pdf-parse` | Python PyPDF2 / Tesseract OCR | Pure Node.js binary parser; executes directly in Express middleware. |
| **Cloud Hosting** | Vercel (Front) + Render (Back) | AWS EC2 / DigitalOcean Droplets | Zero-cost serverless PaaS with automated GitHub CI/CD deployments. |

---

## 12. Top 15 Lab Viva & Technical Interview Questions

### Q1: Why did you choose a Microservices architecture instead of a Monolith?
> **Answer**: JobSync divides the system into two distinct business domains: Student Management and Placement Management. Microservices provide independent database separation (`jobsync_student_db` and `jobsync_placement_db`), allow independent horizontal scaling during high-traffic placement seasons, and prevent a bug in resume PDF processing from bringing down company drive registrations.

### Q2: How does the application handle authentication without external JWT libraries?
> **Answer**: JobSync uses Node.js's native `crypto` library. Passwords are encrypted using `pbkdf2Sync` with a unique 16-byte random salt and 1,000 iterations. For tokens, we construct a signed payload `${userId}:${role}:${timestamp}` signed with an HMAC-SHA256 secret. The token is verified on each request via `authMiddleware.js`.

### Q3: What happens when an unauthenticated user or student tries to access an Admin route?
> **Answer**: Routes are wrapped in the `<ProtectedRoute allowedRole="admin">` component. If unauthenticated, it redirects to `/login`. If logged in as a student, it automatically logs out the student session and navigates to `/login?role=admin` with a notice banner: *"Please log in with Placement Officer credentials to access this portal."*

### Q4: How is PDF resume text extracted and sent to the AI?
> **Answer**: The student uploads a `.pdf` file via a multipart form handled by `multer`. The buffer is passed to `pdf-parse`, which extracts the raw text. The extracted text is sanitized, truncated to 3,000 characters to conserve tokens, and combined with the target job's required skills into a prompt sent to Google Gemini Flash.

### Q5: What if the Gemini AI API key expires or is rate-limited during a live demo?
> **Answer**: JobSync implements the Strategy/Fallback Pattern. In `src/services/aiService.js`, if `analyzeWithGemini()` throws an error, the catch block calls `matchJob()` in `src/ai/jobMatcher.js`. This heuristic engine parses skills using regex tokenization and computes Jaccard similarity metrics locally, ensuring the user always receives an ATS evaluation.

### Q6: Why did you use two separate databases on MongoDB Atlas?
> **Answer**: This follows the Microservices Database-per-Service pattern. Student personal information, applications, and resumes live in `jobsync_student_db`. Company and placement drive information live in `jobsync_placement_db`. This enforces loose coupling: one service cannot perform unauthorized SQL-like joins across database boundaries.

### Q7: How does JobSync calculate drive eligibility?
> **Answer**: Eligibility is calculated synchronously upon checking a drive. The algorithm verifies three rules:
> 1. `student.cgpa >= drive.eligibilityCriteria.minCgpa`
> 2. `student.backlogs <= drive.eligibilityCriteria.maxBacklogs`
> 3. `drive.eligibilityCriteria.allowedDepartments.includes(student.department)`
> If any condition fails, the candidate receives a descriptive error and cannot submit an application.

### Q8: What is the purpose of `frontend/vercel.json`?
> **Answer**: React is a Single Page Application (SPA) where routing is handled on the client by React Router. When a user directly visits or refreshes `/dashboard` on Vercel, the web server looks for a physical file named `dashboard.html`, which does not exist. `vercel.json` adds a rewrite rule redirecting all requests to `/index.html`, allowing React Router to handle the route client-side.

### Q9: How are environment variables managed across microservices?
> **Answer**: Each service has its own `src/config/environment.js` using `dotenv`. Default fallback values allow the service to boot locally with MongoDB Atlas connection strings even if `.env` is omitted, while production environments (Render) override them with environment variables.

### Q10: How does the Notification system work?
> **Answer**: When significant events occur (e.g. drive published, application status changed to `SHORTLISTED`, or interview scheduled), a `Notification` document is inserted into MongoDB with `read: false`. The frontend Navbar queries `/api/v1/notifications`, computes unread items, and displays a counter badge.

### Q11: What is the difference between client-side caching and live API in the dashboard?
> **Answer**: When the Student Service is running, the dashboard displays `● Live API` in green. If the backend service is offline, the frontend's `getStudentDashboard()` catches the network error, retrieves the latest cached profile snapshot from `localStorage`, and displays `● Local Cache` in blue, ensuring zero UI crashes.

### Q12: How are passwords validated upon login?
> **Answer**: The User model defines a `validatePassword(candidatePassword)` method:
> ```javascript
> const hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 1000, 64, 'sha512').toString('hex');
> return this.passwordHash === hash;
> ```
> The candidate password is combined with the user's stored salt and re-hashed. If the resulting string matches `passwordHash`, access is granted.

### Q13: What is the role of Axios Interceptors in `api.js`?
> **Answer**: Interceptors act as middleware for HTTP requests and responses. The request interceptor automatically reads `jobsync_token` from `localStorage` and appends it to `headers.Authorization`. The response interceptor standardizes API payloads into a `{ success: true, data: ... }` structure and handles network error messages gracefully.

### Q14: How does Render's `render.yaml` Blueprint simplify deployment?
> **Answer**: `render.yaml` is an Infrastructure-as-Code file. It tells Render to deploy two Web Services simultaneously (`jobsync-student-service` and `jobsync-placement-service`), specifies their root directories, build commands (`npm install`), start commands (`node src/server.js`), health check paths (`/health`), and environment variables automatically.

### Q15: If you had 6 more months to build JobSync 2.0, what features would you add?
> **Answer**:
> 1. **WebSockets (Socket.IO)**: For instant live notifications without polling.
> 2. **AI Mock Interview Bot**: Using Gemini Audio/Video API to conduct automated mock practice interviews for students.
> 3. **Resume PDF Heatmaps**: Visual indicator showing students exactly which keywords ATS parsers highlighted on their resume.
> 4. **Redis Cache Layer**: To cache frequent company drive listings and reduce database reads.
