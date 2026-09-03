import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS, ROLES } from "../config/roles";

export default function Layout() {
  const { username, role, effectiveRole, viewAsRole, setViewAsRole, logout } =
    useAuth();

  const visibleNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(effectiveRole)
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Monarch Pathways</div>
        <nav>
          {visibleNavItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <span className="topbar-user">Signed in as {username}</span>
          {role === "Admin" && (
            <label className="view-as-switcher">
              View as:{" "}
              <select
                value={viewAsRole || role}
                onChange={(e) =>
                  setViewAsRole(
                    e.target.value === role ? null : e.target.value
                  )
                }
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button className="btn-link" onClick={logout}>
            Log out
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
