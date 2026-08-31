import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { pickChecklistForStudent } from "../data/checklists";
import { BOGUS_SUMMARY_STATS } from "../data/reportingStats";

export default function DashboardPage() {
  const { username, role } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="muted">Welcome back, {username}</span>
      </div>

      {role === "Student" && <StudentDashboard />}
      {role === "Staff" && <StaffDashboard />}
      {role === "Admin" && <AdminDashboard />}
      {role === "Reporting" && <ReportingDashboard />}
      {!role && <p>Loading your dashboard…</p>}
      {role &&
        !["Student", "Staff", "Admin", "Reporting"].includes(role) && (
          <UnassignedDashboard />
        )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Student: only their own checklist info.
// ---------------------------------------------------------------------
function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [checklist, setChecklist] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get("students/me/")
      .then(({ data }) => {
        if (cancelled) return;
        setProfile(data);
        setChecklist(pickChecklistForStudent(data));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleTask(taskId) {
    setChecklist((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      ),
    }));
  }

  if (status === "loading") return <p>Loading your checklist…</p>;
  if (status === "error" || !profile) {
    return (
      <p className="form-error">
        Couldn't load your student profile. Please contact your program
        staff.
      </p>
    );
  }

  const completedCount = checklist.tasks.filter((t) => t.done).length;

  return (
    <div>
      <section className="report-section">
        <h2>My Info</h2>
        <dl className="program-meta">
          <dt>HS Status</dt>
          <dd>{profile.hs_status || "—"}</dd>
          <dt>College Status</dt>
          <dd>{profile.college_status || "—"}</dd>
          <dt>Graduation Date</dt>
          <dd>{profile.graduation_date || "—"}</dd>
        </dl>
      </section>

      <section className="report-section checklist-card">
        <div className="checklist-card-header">
          <div>
            <h2>{checklist.name}</h2>
            <span className="badge badge-active">{checklist.program}</span>
          </div>
          <span className="muted">
            {completedCount}/{checklist.tasks.length} complete
          </span>
        </div>
        <p className="muted">
          Applies to you because: {checklist.criteria}
        </p>
        <ul className="checklist-tasks">
          {checklist.tasks.map((task) => (
            <li key={task.id} className="checklist-task">
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.done ? "checklist-task-done" : ""}>
                  {task.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------
// Staff: list of students.
// ---------------------------------------------------------------------
function StaffDashboard() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    api
      .get("students/")
      .then(({ data }) => {
        if (cancelled) return;
        setStudents(Array.isArray(data) ? data : data.results || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="report-section">
      <div className="checklist-card-header">
        <h2>My Students</h2>
        <Link to="/students">View all students</Link>
      </div>

      {status === "loading" && <p>Loading students…</p>}
      {status === "error" && (
        <p className="form-error">Couldn't load students.</p>
      )}
      {status === "ready" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>HS Status</th>
              <th>College Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 5).map((student) => (
              <tr key={student.id}>
                <td>
                  {student.user_detail?.first_name}{" "}
                  {student.user_detail?.last_name}
                </td>
                <td>{student.hs_status}</td>
                <td>{student.college_status}</td>
                <td>
                  <Link to={`/students/${student.id}`}>View</Link>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------
// Admin: everything at a glance, with quick links.
// ---------------------------------------------------------------------
function AdminDashboard() {
  return (
    <div>
      <div className="stat-grid">
        {BOGUS_SUMMARY_STATS.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <section className="report-section">
        <h2>Quick Links</h2>
        <div className="card-grid">
          <Link className="program-card" to="/students">
            <h2>Students</h2>
            <p className="muted">View and manage student records.</p>
          </Link>
          <Link className="program-card" to="/staff">
            <h2>Staff</h2>
            <p className="muted">View staff accounts and permissions.</p>
          </Link>
          <Link className="program-card" to="/programs">
            <h2>Programs</h2>
            <p className="muted">Browse program configurations.</p>
          </Link>
          <Link className="program-card" to="/reporting">
            <h2>Reporting</h2>
            <p className="muted">View analytics and outcomes.</p>
          </Link>
        </div>
      </section>

      <StaffDashboard />
    </div>
  );
}

// ---------------------------------------------------------------------
// Reporting: read-only analytics summary.
// ---------------------------------------------------------------------
function ReportingDashboard() {
  return (
    <div>
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
      <p>
        <Link to="/reporting">View full reporting breakdown →</Link>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Fallback for accounts without a recognized role.
// ---------------------------------------------------------------------
function UnassignedDashboard() {
  return (
    <p className="form-notice">
      Your account doesn't have a role assigned yet. Contact an
      administrator to get access to Students, Staff, or Reporting.
    </p>
  );
}
