import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getAccessToken,
  api,
} from "../api/client";
import { decodeJwt } from "../api/jwt";

const USERNAME_KEY = "monarch_username";
const ROLE_KEY = "monarch_role";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(
    () => localStorage.getItem(USERNAME_KEY) || null
  );
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || null);

  // If the stored access token has already expired on load, treat the
  // user as logged out so the UI doesn't show a stale session.
  useEffect(() => {
    const token = getAccessToken();
    const claims = decodeJwt(token);
    if (token && claims?.exp && claims.exp * 1000 < Date.now()) {
      apiLogout();
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(ROLE_KEY);
      setUsername(null);
      setRole(null);
    }
  }, []);

  // Keep the role in sync with the backend (it drives which Dashboard
  // view is rendered), refreshing it whenever we have a logged-in user.
  useEffect(() => {
    if (!username || !getAccessToken()) return;
    let cancelled = false;
    api
      .get("auth/me/")
      .then(({ data }) => {
        if (cancelled) return;
        setRole(data.role);
        localStorage.setItem(ROLE_KEY, data.role);
      })
      .catch(() => {
        // Non-fatal: the Dashboard will just fall back to a generic view.
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  async function login(usernameInput, password) {
    await apiLogin(usernameInput, password);
    localStorage.setItem(USERNAME_KEY, usernameInput);
    setUsername(usernameInput);
  }

  function logout() {
    apiLogout();
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    setUsername(null);
    setRole(null);
  }

  const isAuthenticated = Boolean(username && getAccessToken());

  return (
    <AuthContext.Provider
      value={{ username, role, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
