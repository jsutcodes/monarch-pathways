# Monarch Pathways 🦋

An enterprise-grade, highly secure student tracking and mentorship platform custom-built for Colorado Access Navigator (CAN). This application replaces fragmented spreadsheets with an integrated, patient-chart-style system tailored for program administrators, industry advisors, and student development tracking.

## 🚀 Core Features

### 📋 Interactive Student Profiles
- Chronological Timelines: A clean, reverse-chronological feed of all past meetings, milestone updates, and notes.
- Flexible Metadata: Utilizes PostgreSQL JSONB architecture to instantly adapt to changing program requirements (e.g., tracking shifting academic grades, career certifications, or regional school districts) without database migrations.

### 🛡️ Access Control & Compliance
- Role-Based Security: Mentors are restricted to viewing and editing their assigned student portfolios, while Admins maintain regional oversight and master reporting access.Private Escalation Toggles: Mentors can flag sensitive disclosures with a single click, instantly archiving the note from general view and notifying administration for intervention.
- Immutable Audit Logs: Tracks every record modification and access timestamp to ensure data integrity and institutional accountability.

### 📱 Communication Hub 
- (Phase 2 Add-On)Two-Way Web Texting: Integrated cellular texting interface (powered by Twilio) allowing mentors to text students directly from the dashboard, protecting personal phone numbers and maintaining a shared communication history.

## 🛠️ Sustainable Build & Mentorship Model
- Monarch Pathways is developed through a unique community partnership model:Industry-Led Architecture: Designed and overseen by an experienced Industry Advisor providing industry-standard technical direction.Student-Driven Development: Built on the ground by two (2) computer science student engineers. This structure provides the students with critical, real-world portfolio experience to jumpstart their tech careers, while establishing a sustainable, low-cost maintenance pipeline for the CAN organization.

## 💻 Tech Stack
- Frontend: TBD - React / TypeScript (Responsive UI optimized for desktop and mobile)
- Backend: TBD - Node.js (Express) or Python (FastAPI)
- Database: TBD - PostgreSQL (with JSONB check constraints for strict validation rules)
- Infrastructure Hosting: TBD- DigitalOcean or Render (Lean, scalable cloud server architecture)
