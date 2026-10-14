# Student Service – JobSync

The **Student Service** is an independent microservice responsible for student-centric operations in the JobSync Placement Drive Management System.

## Responsibilities

1. **Student Profiles:** Managing student personal, academic, and contact information.
2. **Resume Management:** Resume uploads, storage references, and version control.
3. **AI Resume Analysis:** AI-assisted parsing of resume contents to extract candidate credentials.
4. **Job Matching:** Computing match scores against requirements published by placement drives.
5. **Skill-Gap Analysis:** Identifying candidate skill deficiencies relative to drive criteria.
6. **Applications:** Managing student applications submitted to active placement drives.
7. **Interviews:** Tracking student interview schedules, rounds, and evaluations.
8. **Placements:** Recording final student placement offers and verification history.
9. **Notifications:** Centralized in-app notification engine delivering real-time candidate updates.

## Architecture & Ports
- **Runtime:** Node.js + Express
- **Default Port:** `5001`
- **Database:** MongoDB (`jobsync_student_db`)
- **Inter-service Client:** REST client communicating with Placement Service (`placementServiceClient.js`)
