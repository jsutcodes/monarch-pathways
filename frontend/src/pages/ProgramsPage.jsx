// Placeholder data reflecting the "4 core structural programs" referenced
// in openapi/README.md (section 6, `GET /api/v1/programs`). Swap this for
// a real API call once that endpoint exists.

const BOGUS_PROGRAMS = [
  {
    id: "contigo-summer",
    name: "Contigo Summer",
    description:
      "Summer immersion cohort combining workshops, corporate site visits, and college tours.",
    criteria: "Grades 9–12, active enrollment status",
    enrolled: 142,
    status: "Active",
  },
  {
    id: "college-access",
    name: "College Access",
    description:
      "Core college-readiness pathway covering applications, financial aid, and admissions support.",
    criteria: "Grades 11–12",
    enrolled: 268,
    status: "Active",
  },
  {
    id: "career-pathways",
    name: "Career Pathways",
    description:
      "Career exploration track focused on technical/trade programs and employment readiness.",
    criteria: "Grades 10–12, opted into career track",
    enrolled: 97,
    status: "Active",
  },
  {
    id: "mentorship-match",
    name: "Mentorship Match",
    description:
      "Pairs students with vetted mentors for ongoing check-ins and goal support.",
    criteria: "All grades, active mentor assignment",
    enrolled: 183,
    status: "Active",
  },
];

export default function ProgramsPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Programs</h1>
      </div>

      <p className="form-notice">
        This page is a placeholder populated with sample data. Once{" "}
        <code>GET /api/v1/programs</code> (see <code>openapi/README.md</code>,
        section 6) is implemented, these cards will reflect the real program
        configurations.
      </p>

      <div className="card-grid">
        {BOGUS_PROGRAMS.map((program) => (
          <div className="program-card" key={program.id}>
            <div className="program-card-header">
              <h2>{program.name}</h2>
              <span className="badge badge-active">{program.status}</span>
            </div>
            <p>{program.description}</p>
            <dl className="program-meta">
              <dt>Eligibility criteria</dt>
              <dd>{program.criteria}</dd>
              <dt>Enrolled students</dt>
              <dd>{program.enrolled}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
