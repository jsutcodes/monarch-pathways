import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("students/")
      .then(({ data }) => {
        if (cancelled) return;
        // DRF may paginate (`{results: [...]}`) or return a plain list
        // depending on configuration; support both.
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

  const filtered = students.filter((student) => {
    const name = `${student.user_detail?.first_name ?? ""} ${
      student.user_detail?.last_name ?? ""
    }`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <h1>Students</h1>
        <input
          className="search-input"
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {status === "loading" && <p>Loading students…</p>}
      {status === "error" && (
        <p className="form-error">
          Couldn't load students. Please try again later.
        </p>
      )}

      {status === "ready" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>HS Status</th>
              <th>College Status</th>
              <th>Graduation Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.id}>
                <td>
                  {student.user_detail?.first_name}{" "}
                  {student.user_detail?.last_name}
                </td>
                <td>{student.hs_status}</td>
                <td>{student.college_status}</td>
                <td>{student.graduation_date || "—"}</td>
                <td>
                  <Link to={`/students/${student.id}`}>View</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
