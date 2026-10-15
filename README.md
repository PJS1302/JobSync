# JobSync – Placement Drive Management System

JobSync is a full-stack, microservices-based campus placement drive management system designed to streamline recruitment drives, student profile tracking, resume evaluation, and placement analytics.

> **Status: Fully Integrated & Verified (MAIN ✅)**  
> All microservices (Student Service, Placement Service), the React + Vite frontend portal, and inter-service communication pipelines are fully implemented, tested, and merged into `main`.

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
- **Frontend:** React 18, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Microservices:**
  - **Student Service (Port 5001):** Manages student data, resumes, applications, AI matching, and notifications.
  - **Placement Service (Port 5002):** Manages company listings, placement drives, eligibility rules, and selection rounds.
- **Database:** MongoDB (Dedicated databases per microservice)
- **Inter-service Communication:** REST API clients with fault-tolerant fallbacks
- **Containerization:** Docker & Docker Compose

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (v6+) or Docker

### 1. Running Locally

#### Start Student Service (Port 5001):
```bash
cd services/student-service
npm install
npm start
```

#### Start Placement Service (Port 5002):
```bash
cd services/placement-service
npm install
npm start
```

#### Start Frontend Client (Port 3000):
```bash
cd frontend
npm install
npm run dev
```

### 2. Running with Docker Compose
```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

### 3. Service-to-Service Integration Tests
Verify end-to-end service contracts and inter-service REST workflows:
```bash
node scripts/test_service_integration.js
```
