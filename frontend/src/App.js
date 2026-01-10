import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import VerifyCertificate from "./pages/VerifyCertificate";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicVerify from "./pages/PublicVerify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN ONLY */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* STUDENT ONLY */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="ROLE_USER">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC VERIFICATION */}
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:studentId/:certificateId" element={<VerifyCertificate />} />
        <Route path="/public-verify" element={<PublicVerify />} />

        {/* DEFAULT */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
