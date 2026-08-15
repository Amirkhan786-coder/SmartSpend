import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const currentUser = getCurrentUser();

  // User login nahi hai
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // User logged in hai
  return children;
}

export default ProtectedRoute;