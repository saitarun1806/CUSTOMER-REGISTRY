import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ComplaintDetail from "./pages/ComplaintDetail";
import Notifications from "./pages/Notifications";
import Agents from "./pages/Agents";
import AgentProfile from "./pages/AgentProfile";
import FeedbackAnalytics from "./pages/FeedbackAnalytics";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/complaints/:id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/agents" element={<ProtectedRoute allowedRoles={["admin"]}><Agents /></ProtectedRoute>} />
        <Route path="/agents/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AgentProfile /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><FeedbackAnalytics /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
