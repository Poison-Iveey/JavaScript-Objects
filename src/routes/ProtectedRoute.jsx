import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { JournalContext } from "../context/JournalContext.jsx";

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const journal = useContext(JournalContext);

  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!journal) return null;
  return children;
}
