// Central definition of which roles can see which routes/nav links.
// Keep this in sync with the backend groups: Admin, Staff, Reporting,
// Student (see backend/authentication/group_setup.py).

export const ROLES = ["Admin", "Staff", "Reporting", "Student"];

// Nav links shown in the sidebar, filtered by the current (or "view as")
// role. `roles` also doubles as the allow-list for route access below.
export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", roles: ["Admin", "Staff", "Reporting", "Student"] },
  { to: "/students", label: "Students", roles: ["Admin", "Staff"] },
  { to: "/staff", label: "Staff", roles: ["Admin"] },
  { to: "/programs", label: "Programs", roles: ["Admin", "Staff"] },
  { to: "/checklists", label: "Checklists", roles: ["Admin", "Staff"] },
  { to: "/reporting", label: "Reporting", roles: ["Admin", "Staff", "Reporting"] },
];

// Route-level allow-lists. Paths not listed here default to allowing any
// authenticated role (e.g. /students/:id inherits from /students).
export const ROUTE_ROLES = {
  "/dashboard": NAV_ITEMS.find((i) => i.to === "/dashboard").roles,
  "/students": NAV_ITEMS.find((i) => i.to === "/students").roles,
  "/students/:id": NAV_ITEMS.find((i) => i.to === "/students").roles,
  "/staff": NAV_ITEMS.find((i) => i.to === "/staff").roles,
  "/programs": NAV_ITEMS.find((i) => i.to === "/programs").roles,
  "/checklists": NAV_ITEMS.find((i) => i.to === "/checklists").roles,
  "/reporting": NAV_ITEMS.find((i) => i.to === "/reporting").roles,
};
