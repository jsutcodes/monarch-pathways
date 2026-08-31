import { useEffect, useState } from "react";

// Placeholder analytics data mirroring the "Aggregated Reporting Engine"
// endpoints described in openapi/README.md (section 10). This page is a
// UI placeholder only — swap the bogus data below for real API calls
// (`/api/v1/reports/demographic-integrity`, `/api/v1/reports/program-outcomes`,
// `/api/v1/reports/export`) once those endpoints exist.

const BOGUS_SUMMARY_STATS = [
  { label: "Active Students", value: "1,284", delta: "+4.2%" },
  { label: "FAFSA Completion", value: "76%", delta: "+3.1%" },
  { label: "Avg. Attendance", value: "91%", delta: "-0.8%" },
  { label: "College Enrollment", value: "68%", delta: "+1.6%" },
];

const BOGUS_DEMOGRAPHIC_INTEGRITY = [
  { field: "Gender Identity", missing: 6 },
  { field: "Race / Ethnicity", missing: 11 },
  { field: "Languages Spoken", missing: 22 },
  { field: "First-Gen Status", missing: 4 },
  { field: "Parent Education Level", missing: 18 },
  { field: "Disability/Accessibility Needs", missing: 31 },
];

const BOGUS_PROGRAM_OUTCOMES = [
  { program: "Contigo Summer", attendance: "94%", fafsa: "81%", scholarships: "$142,000" },
  { program: "College Access", attendance: "89%", fafsa: "77%", scholarships: "$96,500" },
  { program: "Career Pathways", attendance: "87%", fafsa: "69%", scholarships: "$54,200" },
  { program: "Mentorship Match", attendance: "92%", fafsa: "74%", scholarships: "$31,800" },
];

export default function ReportingPage() {
  const [generatedAt, setGeneratedAt] = useState(null);

  useEffect(() => {
    setGeneratedAt(new Date());
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Reporting</h1>
        <span className="muted">
          {generatedAt ? `Sample data as of ${generatedAt.toLocaleString()}` : ""}
        </span>
      </div>

      <p className="form-notice">
        This page is a placeholder populated with sample data. Once the
        Aggregated Reporting Engine endpoints (see{" "}
        <code>openapi/README.md</code>, section 10) are implemented, these
        cards and tables will be wired up to live data.
      </p>

      <div className="stat-grid">
        {BOGUS_SUMMARY_STATS.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div
              className={
                "stat-delta " +
                (stat.delta.startsWith("-") ? "stat-delta-down" : "stat-delta-up")
              }
            >
              {stat.delta} vs. last term
            </div>
          </div>
        ))}
      </div>

      <section className="report-section">
        <h2>Demographic Data Integrity</h2>
        <p className="muted">
          % of student records missing each optional demographic field.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Missing / Not Reported</th>
            </tr>
          </thead>
          <tbody>
            {BOGUS_DEMOGRAPHIC_INTEGRITY.map((row) => (
              <tr key={row.field}>
                <td>{row.field}</td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${row.missing}%` }}
                    />
                    <span className="progress-bar-label">{row.missing}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="report-section">
        <h2>Program Outcomes</h2>
        <p className="muted">
          Aggregated attendance, FAFSA completion, and scholarship totals by
          program.
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Avg. Attendance</th>
              <th>FAFSA Completion</th>
              <th>Scholarships Awarded</th>
            </tr>
          </thead>
          <tbody>
            {BOGUS_PROGRAM_OUTCOMES.map((row) => (
              <tr key={row.program}>
                <td>{row.program}</td>
                <td>{row.attendance}</td>
                <td>{row.fafsa}</td>
                <td>{row.scholarships}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="report-section">
        <h2>Export</h2>
        <p className="muted">
          Generate a flat CSV/Excel bundle filtered by grant bounds.
        </p>
        <button type="button" disabled title="Coming soon">
          Export Report (coming soon)
        </button>
      </section>
    </div>
  );
}
