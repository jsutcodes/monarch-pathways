// Placeholder checklist templates, shared by the Checklists page and the
// Student view of the Dashboard. This is future work per the request: task
// lists that will eventually be auto-applied to every student matching a
// program's eligibility criteria (see openapi/README.md, section 7,
// "College & Career Success Checklists"). There's no backend model for
// this yet, so this is just static seed data for the UI.

export const INITIAL_CHECKLISTS = [
  {
    id: "checklist-college-access-seniors",
    program: "College Access",
    name: "Senior Year College Applications",
    criteria: "Grade 12 AND College Status = Applied",
    tasks: [
      { id: "t1", label: "Submit Common App", done: true },
      { id: "t2", label: "Request letters of recommendation", done: true },
      { id: "t3", label: "Complete FAFSA", done: false },
      { id: "t4", label: "Complete CASFA", done: false },
      { id: "t5", label: "Submit at least 2 scholarship applications", done: false },
    ],
  },
  {
    id: "checklist-contigo-summer-onboarding",
    program: "Contigo Summer",
    name: "Cohort Onboarding",
    criteria: "Newly enrolled in Contigo Summer cohort",
    tasks: [
      { id: "t1", label: "Sign program agreement", done: true },
      { id: "t2", label: "Attend orientation session", done: false },
      { id: "t3", label: "Complete intake survey", done: false },
    ],
  },
  {
    id: "checklist-career-pathways-readiness",
    program: "Career Pathways",
    name: "Career Readiness Checklist",
    criteria: "Grades 10-12 AND opted into career track",
    tasks: [
      { id: "t1", label: "Complete career interest inventory", done: true },
      { id: "t2", label: "Attend 1 employer site visit", done: false },
      { id: "t3", label: "Draft resume", done: false },
    ],
  },
];

/**
 * Picks the most relevant placeholder checklist for a given student
 * profile. There's no real program-enrollment link yet, so this just
 * matches on HS status as a stand-in until that data model exists.
 */
export function pickChecklistForStudent(studentProfile) {
  if (!studentProfile) return INITIAL_CHECKLISTS[0];
  if (studentProfile.hs_status?.toLowerCase() === "senior") {
    return (
      INITIAL_CHECKLISTS.find((c) => c.id === "checklist-college-access-seniors") ||
      INITIAL_CHECKLISTS[0]
    );
  }
  return INITIAL_CHECKLISTS[0];
}
