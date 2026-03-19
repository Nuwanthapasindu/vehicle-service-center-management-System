import React from "react";
import { Navigate } from "react-router-dom";
import useAuthentication from "../hooks/auth";

function AuthGuard({ children }) {
  const { isAuthenticated } = useAuthentication();
  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default AuthGuard;