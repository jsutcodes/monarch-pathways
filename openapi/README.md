# College Access Navigators (CAN) — API Specification Document

This document outlines the RESTful API contract for the centralized CAN Student & Program Data Application. It transitions the organization from fragmented spreadsheets to a secure, longitudinal relational student tracking engine.

## 1. Authentication & RBAC (Role-Based Access Control)
Enforces absolute segregation of sensitive records based on user permission scopes.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticates user; returns JWT token with role claims. | Public |
| `GET` | `/api/v1/users` | Lists system accounts, staff rosters, and vetted mentors. | Admin |
| `POST` | `/api/v1/users` | Provisions a new staff or mentor profile context. | Admin |
| `PATCH` | `/api/v1/users/{id}/permissions` | Restricts or upgrades granular system access flags. | Admin |

---

## 2. Core Longitudinal Student Records
Manages basic identities and lifecycle states across the master record layer.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students` | Queries and filters students (e.g., `?status=active&grade=12`). | Admin, Staff |
| `POST` | `/api/v1/students` | Registers root profile; auto-generates unique Student ID. | Admin, Staff |
| `GET` | `/api/v1/students/{id}` | Fetches unified foundational profile layout. | Admin, Staff, Mentor (Assigned Only) |
| `PATCH` | `/api/v1/students/{id}` | Updates mutable contact arrays, pronouns, or state changes. | Admin, Staff |
| `DELETE` | `/api/v1/students/{id}` | Soft-deletes/archives a student record. | Admin |

---

## 3. Demographics & Sensitive Records
Isolated subsystem built to keep protected attributes away from unvetted views while respecting opt-out flags.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students/{id}/demographics` | Fetches protected attributes (race, first-gen status, orientation). | Admin, Staff (Mentors Blocked) |
| `PUT` | `/api/v1/students/{id}/demographics` | Upserts fields; explicitly allows `"prefer_not_to_answer"`. | Admin, Staff |

---

## 4. Educational History & Preservation Logs
Appends school or grade shifts to a historic ledger instead of overwriting master columns.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students/{id}/education` | Views continuous chronological log of historic school transitions. | Admin, Staff, Mentor (Assigned Only) |
| `POST` | `/api/v1/students/{id}/education` | Appends a new school, grade, or postsecondary enrollment milestone. | Admin, Staff |

---

## 5. Asset-Based Metrics (Goals & Strengths)
Tracks qualitative statements, pride markers, and evolving student ambitions over time.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students/{id}/goals-strengths` | Retrieves checked goals, proud statements, and interests. | Admin, Staff, Mentor (Assigned Only) |
| `POST` | `/api/v1/students/{id}/goals-strengths` | Commits a new snapshot of goals as student desires shift. | Admin, Staff, Mentor (Assigned Only) |

---

## 6. Program Enrollments (Multi-Pathway Engine)
Allows individual records to concurrently map across CAN’s four primary tracks.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/programs` | Returns static configurations for the 4 core structural programs. | All Authenticated Users |
| `POST` | `/api/v1/students/{id}/enrollments` | Enrolls a student into a track with specific cohort tags. | Admin, Staff |
| `PATCH` | `/api/v1/students/{id}/enrollments/{envId}` | Records exit dates, drop reasons, or cohort adjustments. | Admin, Staff |

---

## 7. College & Career Success Checklists
Tracks financial aid tracking matrices and workflow statuses for applications.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students/{id}/college-career` | Fetches consolidated pathway checklist metrics. | Admin, Staff |
| `PATCH` | `/api/v1/students/{id}/college-career/applications` | Updates progress logs for university or trade applications. | Admin, Staff |
| `PATCH` | `/api/v1/students/{id}/college-career/financial-aid` | Tracks checklist state workflow for FAFSA or CASFA filings. | Admin, Staff |
| `PATCH` | `/api/v1/students/{id}/college-career/scholarships` | Records deadlines, submitted state, and awarded amounts. | Admin, Staff |

---

## 8. Contigo Summer Module
Aggregates attendance matrix configurations and specialized group activities.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/programs/contigo/cohorts/{year}/metrics` | Pulls system-calculated aggregate values (attendance rates). | Admin, Staff |
| `POST` | `/api/v1/programs/contigo/activities` | Logs centralized workshops, corporate visits, or college tours. | Admin, Staff |
| `POST` | `/api/v1/programs/contigo/attendance` | Batch-posts daily attendance matrix sheets for a cohort. | Admin, Staff, Interns |

---

## 9. Mentorship Match Ledger
Connects mentors to program clients safely while preventing unauthorized record leaking.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/mentorship/matches` | Links a mentor profile ID to a student ID with type tags. | Admin, Staff |
| `GET` | `/api/v1/mentorship/matches/{matchId}/sessions` | Pulls interaction notes logged beneath that specific pair. | Admin, Staff, Assigned Mentor |
| `POST` | `/api/v1/mentorship/sessions` | Standard logging target for weekly check-ins and resource needs. | Assigned Mentor |

---

## 10. Aggregated Reporting Engine
Processes analytical equations safely for reporting data to boards and funders without compromising identity compliance.

| Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/reports/demographic-integrity` | Computes percentage matrices of missing or omitted database fields. | Admin |
| `GET` | `/api/v1/reports/program-outcomes` | Aggregates real-time attendance averages and FAFSA completion KPIs. | Admin |
| `GET` | `/api/v1/reports/export` | Generates strict, flat CSV/Excel bundles filtered by grant bounds. | Admin |
