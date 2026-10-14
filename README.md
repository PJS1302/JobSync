# JobSync – Placement Drive Management System

JobSync is a full-stack, microservices-based campus placement drive management system designed to streamline recruitment drives, student profile tracking, resume evaluation, and placement analytics.

> **Status: Initial Project Structure**  
> This repository contains the initialized architectural skeleton and directory layout. Active implementation of services, APIs, and user interfaces is currently under development.

---

## 📌 Project Overview

JobSync facilitates seamless interaction between students and placement coordinators through modern web technologies, independent microservices, and AI-assisted automation.

### Key Capabilities
- **Decoupled Architecture:** Autonomous backend microservices communicating via secure REST APIs.
- **Smart Resume Analysis:** AI-assisted resume parsing, skill extraction, and drive compatibility matching.
- **Placement Drive Management:** Comprehensive lifecycle tracking from drive announcement and eligibility screening to final selection.
- **Integrated In-App Notifications:** Real-time application updates and interview scheduling alerts managed within the student service.
- **Modern Student & Admin Portals:** Intuitive, responsive dashboard powered by React and Vite.

---

## 🏗️ Architecture & Technology Stack

```
+-------------------------------------------------------------+
|                      React + Vite UI                        |
|             (Student Portal / Admin Dashboard)              |
+------------------------------+------------------------------+
                               |
               REST API calls  |
        +----------------------+----------------------+
        |                                             |
        v                                             v
+-----------------------+             +-----------------------+
|    Student Service    |  REST APIs  |   Placement Service   |
|   (Node.js / Express) |<----------->|  (Node.js / Express)  |
|  - Student Profiles   |             |  - Companies          |
|  - AI Resume Analysis |             |  - Placement Drives   |
|  - Applications       |             |  - Eligibility Rules  |
|  - In-App Alerts      |             |  - Interview Rounds   |
+-----------+-----------+             +-----------+-----------+
            |                                     |
            v                                     v
+-----------------------+             +-----------------------+
|  Student Database     |             |  Placement Database   |
|      (MongoDB)        |             |      (MongoDB)        |
+-----------------------+             +-----------------------+
```

### Technology Stack
- **Frontend:** React 18, Vite, Vanilla CSS design system
- **Backend:** Node.js, Express.js
- **Microservices:**
  - **Student Service (Port 5001):** Manages student data, resumes, applications, AI matching, and notifications.
  - **Placement Service (Port 5002):** Manages company listings, placement drives, eligibility rules, and selection rounds.
- **Database:** MongoDB (Dedicated databases per microservice)
- **Inter-service Communication:** REST API clients
- **API Documentation & Testing:** Postman Collections & Markdown specifications
- **Containerization:** Docker Compose

---

## 🤖 Planned AI Features
- **Resume Parser:** Structured data extraction from uploaded candidate resumes.
- **Skill Extractor:** Automatic technical and soft skill tagging.
- **Job Matcher:** Drive-to-resume compatibility scoring based on role requirements.
- **Skill Gap Analyzer:** Actionable feedback on missing prerequisites for target job postings.

---

## 🔔 In-App Notification System
- Notifications are managed centrally as part of the **Student Service** (no extraneous microservices).
- Delivers status updates on drive eligibility, interview schedules, shortlist notices, and final selections.

---

## 📁 Repository Structure

```text
JobSync/
├── frontend/               # React + Vite client application
├── services/
│   ├── student-service/    # Profiles, resumes, AI analysis, notifications
│   └── placement-service/  # Drives, companies, eligibility, rounds
├── postman/                # Postman collections & environment configs
├── docs/                   # Architecture, database, and API documentation
├── docker-compose.yml      # Local container orchestration
└── README.md               # Repository documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (v6+) or Docker

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/PJS1302/JobSync.git
   cd JobSync
   ```
2. Configure environment variables by copying `.env.example` in each service:
   ```bash
   cp frontend/.env.example frontend/.env
   cp services/student-service/.env.example services/student-service/.env
   cp services/placement-service/.env.example services/placement-service/.env
   ```
3. Install dependencies and start services once implemented.
