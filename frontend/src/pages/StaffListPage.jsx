import { useEffect, useState } from "react";
import { api } from "../api/client";

const PERMISSIONS_PREVIEW_COUNT = 3;

export default function StaffListPage() {
  const [staff, setStaff] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("auth/staff/")
      .then(({ data }) => {
        if (cancelled) return;
        // DRF may paginate (`{results: [...]}`) or return a plain list
        // depending on configuration; support both.
        setStaff(Array.isArray(data) ? data : data.results || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = staff.filter((member) => {
    const name = `${member.first_name ?? ""} ${member.last_name ?? ""} ${
      member.username ?? ""
    }`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <h1>Staff</h1>
        <input
          className="search-input"
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {status === "loading" && <p>Loading staff…</p>}
      {status === "error" && (
        <p className="form-error">
          Couldn't load staff. Please try again later.
        </p>
      )}

      {status === "ready" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Groups</th>
              <th>Permissions</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => {
              const permissions = member.permissions || [];
              const preview = permissions.slice(0, PERMISSIONS_PREVIEW_COUNT);
              const remaining = permissions.length - preview.length;
              return (
                <tr key={member.id}>
                  <td>
                    {member.first_name} {member.last_name}
                  </td>
                  <td>{member.email || "—"}</td>
                  <td>{member.role}</td>
                  <td>
                    {member.groups?.length
                      ? member.groups.map((g) => g.name).join(", ")
                      : "—"}
                  </td>
                  <td title={permissions.join("\n")}>
                    {member.is_superuser
                      ? "All (superuser)"
                      : preview.length
                      ? `${preview.join(", ")}${
                          remaining > 0 ? ` +${remaining} more` : ""
                        }`
                      : "None"}
                  </td>
                  <td>{member.is_active ? "Active" : "Inactive"}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6}>No staff found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
