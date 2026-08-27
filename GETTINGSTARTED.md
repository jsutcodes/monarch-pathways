# Getting Started:

Welcome to the team! This repository contains a production-ready, modular Django skeleton designed to track student milestones, mentor relationships, and advisory meetings. 

As an intern on this project, your role will be to flesh out the core security, validation, and business logic markers left throughout the codebase, and to implement new core features. 

---

## 🛠️ Initial Local Development Setup

Follow these steps exactly to clone, configure, and execute the backend engine on your local development machine.

### 1. Environment & Dependencies Isolation
Navigate to the root directory of your cloned repository and create an isolated Python virtual environment:
```bash
# Create the environment directory
python -m venv venv

# Activate the environment
# On macOS/Linux:
source venv/bin/activate
# On Windows (Command Prompt):
.\venv\Scripts\activate
# On Windows (PowerShell):
.\venv\Scripts\activate.ps1
```

Once activated, upgrade your core package installer and pull down the required project extensions:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Run Database Migrations
This application maps standard Python classes cleanly to database schemas using Django's native migration system. Run the initial sync to set up your local SQLite instance:
```bash
python manage.py makemigrations authentication students meetings
python manage.py migrate
```

### 3. Generate a Superuser Account
To access the automated web management panel, create an Administrative root account:
```bash
python manage.py createsuperuser
```
Follow the terminal prompts to configure your username, email, and password.

### 4. Boot Up the Engine
Fire up the local multi-threaded development web server:
```bash
python manage.py runserver
```
Open your browser and navigate to `http://127.0.0.1:8000` to log in using the superuser credentials you just generated.

---

## 📂 System Architecture Overview

The codebase is organized into small, decoupled applications following standard Django design patterns:
*   `core/`: Hosts project-wide configurations, database connections, and centralized logger pipelines routing events straight to `logs/auth_audit.log`.
*   `authentication/`: Handles the system `User` table, token lifecycles, permissions groups, and login hook signals.
*   `students/`: Tracks profile structures for `StudentProfile` and `MentorProfile`, alongside the tracking junctions binding them together.
*   `meetings/`: Contains schemas managing interaction loops, private notes, and calendar items.

---

## 🎯 Intern Assignment Milestones (`# TODO` Roadmap)

Your project contributions are tracked via specific tasks labeled throughout the code files. Open your IDE's task manager and filter for `TODO`. Your assignments are categorized into three major phases:

### Phase 1: Cryptographic Isolation At Rest (Data Privacy)
*   **Locations:** `authentication/models.py`, `students/models.py`
*   **Objective:** Personal information (PII) including contact info, addresses, and telephone numbers must not reside as plain-text raw strings in our active database tables.
*   **Task:** Integrate a secure field wrapper framework (such as `django-fernet-fields` or similar cryptographic engine extensions) to seamlessly encrypt data points during system write procedures and automatically decrypt them on retrieval.

### Phase 2: Signal Log Engineering (Audit & Logging)
*   **Location:** `authentication/signals.py`
*   **Objective:** Security compliance rules demand append-only log capture tracking incoming authentications to prevent auditing bypass vulnerabilities.
*   **Task:** Complete the network string extraction parser logic inside the `log_user_login` routine. Ensure it strips incoming upstream load-balancer proxies or CDN proxy layers (e.g., parsing `HTTP_X_FORWARDED_FOR`) to accurately identify and append client source IP addresses into `logs/auth_audit.log`.

### Phase 3: Row-Level Security Middleware (Authorization Enforcement)
*   **Location:** `meetings/views.py`
*   **Objective:** Mentors must have their view access boundaries explicitly constrained. A general Mentor should never have authorization privileges to view, edit, or access meeting records or notes belonging to students they aren't directly matched with.
*   **Task:** Write custom Django REST Framework (`DRF`) permission matrices. Inject validation logic that looks up the `MentorStudentAssignment` relationships table to systematically block access with a `403 Forbidden` error if an cross-match breach attempt is made.

---

## 🧪 Testing and Validation

Do not commit code directly to `main`. Once you finish a `TODO` task, run the system unit tests to ensure no core regressions occurred:
```bash
python manage.py test
```

Always structure your updates into a separate feature branch (`feature/your-task-name`) and issue a comprehensive Pull Request against the development target. Happy coding!
