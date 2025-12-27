import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role check (if role is specified)
  if (role && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
