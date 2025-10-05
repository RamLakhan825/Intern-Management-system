import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRegister from "./pages/admin/AdminRegister.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import ManageInterns from "./pages/admin/ManageInterns";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageTasks from "./pages/admin/ManageTasks";
import ManageExams from "./pages/admin/ManageExams";
import PrivateRoute from "./components/PrivateRoute.jsx";
import RoleSelection from "./pages/RoleSelection";
import InternLogin from "./pages/intern/InternLogin";
import InternRegister from "./pages/intern/InternRegister";
import InternDashboard from "./pages/intern/InternDashboard.jsx";
import TakeExam from "./pages/intern/TakeExam";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        {/* Public routes */}
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/intern/login" element={<InternLogin />} />
  <Route path="/intern/register" element={<InternRegister />} />
  <Route path="/intern/dashboard" element={<InternDashboard />} />
  <Route path="/intern/exam/:examId" element={<TakeExam />} />

        {/* Protected routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/interns"
          element={
            <PrivateRoute>
              <ManageInterns />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <PrivateRoute>
              <ManageProjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <PrivateRoute>
              <ManageTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <PrivateRoute>
              <ManageExams />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
