# Monarch Pathways 🦋

An enterprise-grade, highly secure student tracking and mentorship platform custom-built for Colorado Access Navigator (CAN). This application replaces fragmented spreadsheets with an integrated, clinical-grade system tailored for program administrators, industry advisors, and student development tracking.

Monarch Pathways is built using an industry-standard, code-first design pattern. Instead of relying on manual database scripting tools like Liquibase, it utilizes Python-driven Object-Relational Mapping (ORM) to ensure rapid development, seamless maintenance, and bulletproof security.

---

## 🚀 Core Features

### 📋 Interactive Student Profiles
*   **Chronological Timelines:** A clean, reverse-chronological feed aggregation of past meetings, milestone updates, and notes.
*   **Flexible Data Extensions:** Utilizes relational foreign key profiles to isolate student and mentor data cleanly while retaining native database indexing speed.
*   **Encrypted PII Architecture:** Personal Identifiable Information (PII) like phone numbers and physical addresses are encrypted at rest using database-level cryptography.

### 🛡️ Access Control & Compliance
*   **Role-Based Security:** Row-level permissions restrict general Mentors to viewing and editing only their assigned student portfolios.
*   **Administrative Oversight:** Lead Mentors and Admins maintain master regional reporting tools and cohort matching dashboards.
*   **Private Escalation Toggles:** Sensitive disclosures can be instantly flagged to archive notes from general view and trigger administrative intervention.
*   **Append-Only Audit Logging:** System log files trap network-level authentication events independently to isolate tracking data and prevent audit tampering.

### 📱 Communication Hub
*   **Two-Way Web Texting (Phase 2):** Integrated cellular texting interfaces allowing mentors to message students directly from the dashboard, keeping personal phone numbers private while maintaining an institutional communication history.

---

## 💻 Technical Stack

*   **Backend Framework:** Python 3.11+ & Django 5.0 (Batteries-included enterprise framework)
*   **API Management:** Django REST Framework (DRF) & DRF-SimpleJWT (Secure token-based auth cycles)
*   **Database Engine:** PostgreSQL (Optimized relational storage with strict foreign key constraints)
*   **Local Storage:** SQLite (Utilized as a lightweight, agnostic local testing fallback environment)
*   **Code Quality Pipelines:** GitHub Actions CI automating Flake8 linting, Black formatting, and Bandit security scans.
*   **Infrastructure Hosting:** TBD — DigitalOcean or Render (Lean, scalable cloud server architecture)

---

## 🛠️ Sustainable Build & Mentorship Model

Monarch Pathways is developed through a unique community partnership model:
*   **Industry-Led Architecture:** Designed and overseen by an experienced Industry Advisor providing industry-standard technical direction and structural blueprints.
*   **Student-Driven Development:** Built on the ground by two (2) computer science student engineers. This structure provides students with critical, real-world portfolio experience to jumpstart their tech careers, while establishing a sustainable, low-cost maintenance pipeline for the CAN organization.

---

## 🚀 Onboarding & Developer Setup

If you are a student developer or an intern joining the project engineering team, your onboarding track is fully mapped out. 

Please review our step-by-step developer environment installation guidelines, local database migration scripts, and your code-level assignment roadmap inside the **[Getting Started Guide](GETTING_STARTED.md)**.
