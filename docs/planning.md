# Intern Task Planning

This document organizes available work into buckets by skill level, so you
can pick tasks that match your comfort with the codebase. Feel free to move
up a tier as you get more comfortable — these aren't strict prerequisites.

---

## Bucket 1: Frontend Polish & UX

Good starting tasks if you're most comfortable with React/CSS and want to
get familiar with the codebase's conventions before touching the backend.

- **Reporting, Programs, and Checklists pages** currently use hardcoded
  placeholder data. Add loading skeletons, empty states, and form
  validation to match the polish level of the Students/Staff pages.
- **Design system cleanup** — several card/badge/table styles are
  duplicated across `styles.css`. Extract shared, reusable classes (or
  components) and reduce repetition.
- **Accessibility pass** — audit forms and tables for proper labels, ARIA
  attributes, and keyboard navigation.
- **Responsive layout** — verify and improve the app shell/sidebar/tables
  on smaller screen sizes.
- **Seed/demo data script** — build a Django management command that
  generates realistic fake students, staff, and meetings for local
  development and demos.

---

## Bucket 2: Backend Feature Work

Medium-difficulty tasks that involve Django models, serializers, views,
and permissions. A good next step once you're comfortable navigating the
project structure.

- **Django Admin registration** — register the custom `User` model
  (`backend/authentication/admin.py`) so it displays properly in the standard
  Django Admin interface.
- **Meeting notes API** — define and wire up endpoints for meeting notes
  (`backend/meetings/urls.py`), including validation that notes can't be created
  for non-existent meetings (`backend/meetings/serializers.py`).
- **Mentor assignment permissions** — build a custom DRF permission class
  that checks whether the requesting user is linked to a student via a
  `MentorStudentAssignment` before allowing access (`backend/meetings/views.py`).
- **Serializer field guarding** — build a field mapper for
  `StudentProfileSerializer` that allows write transitions for editable
  fields while guarding internal system flags (`backend/students/serializers.py`).
- **Login/audit signal parsing** — extract IP address and username
  context from login signals (`backend/authentication/signals.py`) for security
  logging, without exposing raw passwords.
- **Route wiring** — once the meetings endpoints exist, connect them into
  the main URL configuration (`backend/core/urls.py`).

---

## Bucket 3: Testing, Tooling & Advanced Topics

More advanced tasks suited for interns who want a deeper technical
challenge and are comfortable working independently.

- **Code coverage** (assigned separately — see your GitHub task).
- **Backend test coverage** — write DRF `APITestCase` tests for existing
  viewsets and serializers (e.g., `StudentViewSet`, `StaffViewSet`).
- **Frontend test coverage** — set up Vitest + React Testing Library and
  add component tests for key pages (`StudentsListPage`, `StaffListPage`,
  etc.).
- **Encryption at rest** — implement a real encryption abstraction (e.g.,
  `django-fernet-fields`) for sensitive fields like
  `encrypted_contact_info`, `encrypted_phone`, and `encrypted_address`.
- **Custom JWT/token behavior** — implement DRF or token-based login
  overrides if custom authentication behavior is needed
  (`backend/authentication/views.py`).
- **Documentation** — expand `GETTING_STARTED.md`, add docstrings/JSDoc
  across the codebase, and keep `openapi/README.md` in sync as new
  endpoints are implemented.
- **Observability** — add structured request logging or a timing
  middleware, building on the existing `LOGGING` configuration.

---

## How to pick a task

1. Start in the bucket that matches your current comfort level.
2. Check with a mentor before starting, since some tasks may depend on
   others being finished first.
3. Open a draft PR early so we can give feedback along the way.
