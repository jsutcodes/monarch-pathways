import { createContext, useContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  getAccessToken,
} from "../api/client";
import { decodeJwt } from "../api/jwt";

const USERNAME_KEY = "monarch_username";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(
    () => localStorage.getItem(USERNAME_KEY) || null
  );

  // If the stored access token has already expired on load, treat the
  // user as logged out so the UI doesn't show a stale session.
  useEffect(() => {
    const token = getAccessToken();
    const claims = decodeJwt(token);
    if (token && claims?.exp && claims.exp * 1000 < Date.now()) {
      apiLogout();
      localStorage.removeItem(USERNAME_KEY);
      setUsername(null);
    }
  }, []);

  async function login(usernameInput, password) {
    await apiLogin(usernameInput, password);
    localStorage.setItem(USERNAME_KEY, usernameInput);
    setUsername(usernameInput);
  }

  function logout() {
    apiLogout();
    localStorage.removeItem(USERNAME_KEY);
    setUsername(null);
  }

  const isAuthenticated = Boolean(username && getAccessToken());

  return (
    <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
