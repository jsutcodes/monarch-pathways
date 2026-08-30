import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { username, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Monarch Pathways</div>
        <nav>
          <NavLink to="/students" className="nav-link">
            Students
          </NavLink>
        </nav>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <span className="topbar-user">Signed in as {username}</span>
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
