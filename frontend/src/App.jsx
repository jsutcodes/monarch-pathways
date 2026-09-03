import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";
import { ROUTE_ROLES } from "./config/roles";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsListPage from "./pages/StudentsListPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import StaffListPage from "./pages/StaffListPage";
import ReportingPage from "./pages/ReportingPage";
import ProgramsPage from "./pages/ProgramsPage";
import ChecklistsPage from "./pages/ChecklistsPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/students"
            element={
              <RoleRoute allow={ROUTE_ROLES["/students"]}>
                <StudentsListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <RoleRoute allow={ROUTE_ROLES["/students/:id"]}>
                <StudentDetailPage />
              </RoleRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <RoleRoute allow={ROUTE_ROLES["/staff"]}>
                <StaffListPage />
              </RoleRoute>
            }
          />
          <Route
            path="/reporting"
            element={
              <RoleRoute allow={ROUTE_ROLES["/reporting"]}>
                <ReportingPage />
              </RoleRoute>
            }
          />
          <Route
            path="/programs"
            element={
              <RoleRoute allow={ROUTE_ROLES["/programs"]}>
                <ProgramsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/checklists"
            element={
              <RoleRoute allow={ROUTE_ROLES["/checklists"]}>
                <ChecklistsPage />
              </RoleRoute>
            }
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
