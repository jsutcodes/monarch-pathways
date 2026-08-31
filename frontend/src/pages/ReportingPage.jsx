import { useEffect, useState } from "react";
import {
  BOGUS_SUMMARY_STATS,
  BOGUS_DEMOGRAPHIC_INTEGRITY,
  BOGUS_PROGRAM_OUTCOMES,
} from "../data/reportingStats";

// Placeholder analytics data mirroring the "Aggregated Reporting Engine"
// endpoints described in openapi/README.md (section 10). This page is a
// UI placeholder only — swap the bogus data below for real API calls
// (`/api/v1/reports/demographic-integrity`, `/api/v1/reports/program-outcomes`,
// `/api/v1/reports/export`) once those endpoints exist.


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
