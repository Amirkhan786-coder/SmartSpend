import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const userId = localStorage.getItem("userId");
  const smartSpendUser = localStorage.getItem("smartSpendUser");

  // Login nahi hai
  if (!userId || !smartSpendUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;