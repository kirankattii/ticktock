import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import { useAuth } from "../context/AuthContext";
import WeeklyTimeSheet from "../pages/weeklyTimesheet/weeklyTimeSheet";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/weekly-timesheet/:id?"
        element={
          <ProtectedRoute>
            <WeeklyTimeSheet />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
