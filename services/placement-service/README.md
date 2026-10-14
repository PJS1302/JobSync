# Placement Service – JobSync

The **Placement Service** is an independent microservice responsible for company partnerships, placement drive coordination, and candidate screening in the JobSync Placement Drive Management System.

## Responsibilities

1. **Companies:** Managing participating recruiters, hiring partner records, and corporate POCs.
2. **Placement Drives:** Coordinating placement drive creation, lifecycle, job roles, and scheduling.
3. **Eligibility Rules:** Defining and validating criteria (GPA thresholds, backlogs, department filters).
4. **Candidate Screening:** Screening student applicants against drive eligibility criteria.
5. **Interview Rounds:** Configuring evaluation stages (Aptitude, Technical, HR, Group Discussion).
6. **Selection:** Managing candidate shortlisting, progression through rounds, and final selections.
7. **Analytics:** Generating placement statistics, company engagement metrics, and drive performance reports.

## Architecture & Ports
- **Runtime:** Node.js + Express
- **Default Port:** `5002`
- **Database:** MongoDB (`jobsync_placement_db`)
- **Inter-service Client:** REST client communicating with Student Service (`studentServiceClient.js`)
