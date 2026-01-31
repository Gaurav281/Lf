import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/admin/login" />;
  return children;
}
