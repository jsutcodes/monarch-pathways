import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

const EDITABLE_FIELDS = [
  { name: "hs_status", label: "High School Status" },
  { name: "college_status", label: "College Status" },
  { name: "dob", label: "Date of Birth", type: "date" },
  { name: "graduation_date", label: "Graduation Date", type: "date" },
  { name: "country_of_origin", label: "Country of Origin" },
];

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    let cancelled = false;
    api
      .get(`students/${id}/`)
      .then(({ data }) => {
        if (cancelled) return;
        setStudent(data);
        setForm(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaveState("saving");
    try {
      const payload = {};
      EDITABLE_FIELDS.forEach(({ name }) => {
        payload[name] = form[name];
      });
      const { data } = await api.patch(`students/${id}/`, payload);
      setStudent(data);
      setForm(data);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  if (status === "loading") return <p>Loading student…</p>;
  if (status === "error" || !student) {
    return (
      <div>
        <p className="form-error">Couldn't load this student.</p>
        <Link to="/students">Back to Students</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/students" className="back-link">
        ← Back to Students
      </Link>
      <h1>
        {student.user_detail?.first_name} {student.user_detail?.last_name}
      </h1>
      <p className="muted">{student.user_detail?.email}</p>

      <form className="detail-form" onSubmit={handleSave}>
        {EDITABLE_FIELDS.map(({ name, label, type }) => (
          <div className="form-row" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              type={type || "text"}
              value={form[name] || ""}
              onChange={(e) => handleChange(name, e.target.value)}
            />
          </div>
        ))}

        {saveState === "saved" && (
          <div className="form-success">Saved.</div>
        )}
        {saveState === "error" && (
          <div className="form-error">Couldn't save changes.</div>
        )}

        <button type="submit" disabled={saveState === "saving"}>
          {saveState === "saving" ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
