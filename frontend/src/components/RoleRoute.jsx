import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Restricts a route to a set of allowed roles. Uses `effectiveRole` so an
// Admin's "view as" selection is respected, while every other role only
// ever sees routes their real role is allowed to access.
export default function RoleRoute({ allow, children }) {
  const { effectiveRole } = useAuth();

  // Role hasn't loaded yet (e.g. right after login); ProtectedRoute already
  // guarantees we're authenticated, so just wait rather than bouncing away.
  if (!effectiveRole) return null;

  if (!allow.includes(effectiveRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
