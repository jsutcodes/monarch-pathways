// Placeholder analytics data mirroring the "Aggregated Reporting Engine"
// endpoints described in openapi/README.md (section 10). Shared by the
// Reporting page and the Reporting/Admin views of the Dashboard. Swap for
// real API calls (`/api/v1/reports/*`) once those endpoints exist.

export const BOGUS_SUMMARY_STATS = [
  { label: "Active Students", value: "1,284", delta: "+4.2%" },
  { label: "FAFSA Completion", value: "76%", delta: "+3.1%" },
  { label: "Avg. Attendance", value: "91%", delta: "-0.8%" },
  { label: "College Enrollment", value: "68%", delta: "+1.6%" },
];

export const BOGUS_DEMOGRAPHIC_INTEGRITY = [
  { field: "Gender Identity", missing: 6 },
  { field: "Race / Ethnicity", missing: 11 },
  { field: "Languages Spoken", missing: 22 },
  { field: "First-Gen Status", missing: 4 },
  { field: "Parent Education Level", missing: 18 },
  { field: "Disability/Accessibility Needs", missing: 31 },
];

export const BOGUS_PROGRAM_OUTCOMES = [
  { program: "Contigo Summer", attendance: "94%", fafsa: "81%", scholarships: "$142,000" },
  { program: "College Access", attendance: "89%", fafsa: "77%", scholarships: "$96,500" },
  { program: "Career Pathways", attendance: "87%", fafsa: "69%", scholarships: "$54,200" },
  { program: "Mentorship Match", attendance: "92%", fafsa: "74%", scholarships: "$31,800" },
];
