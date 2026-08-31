import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
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
          <Route path="/students" element={<StudentsListPage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/staff" element={<StaffListPage />} />
          <Route path="/reporting" element={<ReportingPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/checklists" element={<ChecklistsPage />} />
          <Route path="/" element={<Navigate to="/students" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
    </AuthProvider>
  );
}
