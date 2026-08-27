## 📱 Frontend Interface Architecture

Monarch Pathways utilizes a clean, data-dense layout optimized for rapid case management. The user interface is built as a single-page application (SPA) mapped into four primary logical views:

### 🗂️ View A: The Unified Sidebar & Layout
Provides a persistent layout frame across all authenticated system sections.
*   **Persistent Left Navigation:** A structural navigation rail containing quick links to `Dashboard Home`, `My Students`, `Calendar/Meetings`, and `System Settings` (conditionally visible to Administrative profiles only). Collapses dynamically on mobile device viewports.
*   **Global Actions Top-Bar:** Displays authenticated profile identifiers, an explicit security access badge (e.g., `[Mentor]`), and an immediate session termination/logout option.

### 📊 View B: The Student Directory (Data Table)
The core dashboard interface used by mentors to manage active cases.
*   **Contextual Row Filters:** Displays an optimized, row-dense grid mapping students directly assigned to the logged-in Mentor account (or a total regional matrix if authenticated as an Admin).
*   **Search & Facet UI Utilities:** Built-in keyword inputs matching first/last names, combined with state filter badges (`Prospective`, `Applied`, `Enrolled`), and graduation calendar year dropdown selectors.
*   **Seamless Drills:** Deep-linking behavior across individual row indexes routes instantly to the target student's specialized file workspace.

### 🩺 View C: The "Patient Chart" Student Profile (Core View)
The primary system console screen. It isolates critical data points using a high-density, three-column column layout:
*   **Left Column (The Metadata Card):** Displays static profile benchmarks. Encapsulates full student naming keys, security-masked contact data fields (decrypted conditionally based on active access privileges), academic standing, High School progression tracking, and post-secondary statuses.
*   **Middle Column (Chronological Feed Timeline):** A clean vertical history track ordering all physical client system interactions in a strict reverse-chronological feed. Each entry operates as an interactive card parsing a scheduled event or an explicit milestone modification history block (e.g., *"Aug 2026 — Meeting with Advisor John (Status: Completed). Summary: Finalized FAFSA submission verification documents"*).
*   **Right Column (Active Action Items / Milestones):** A reactive checklist track isolating high-priority student milestones (e.g., `[ ] Submit Institutional Scholarship Application — Due Oct 1st`). Interacting with any tracking checkbox initiates an immediate asynchronous update transaction down to the database persistence layer.

### 📝 View D: The Meeting Logger & Note Editor
An focused tracking canvas instantiated via inline routes or a modal interface immediately during or following standard student tracking engagements.
*   **Rich Summary Canvas:** Incorporates Markdown/Rich-Text formatting handlers to streamline detailed event logs and meeting notes.
*   **Administrative Escalation Safety Check:** A persistent critical toggle switch field labeled **"Flag for Administrative Escalation"**. Activating this toggle alters the UI border canvas to a bright warning red state, notifying the advisor that a sensitive security alert or student support event is being marked for prioritized administrative review and manual intervention.
