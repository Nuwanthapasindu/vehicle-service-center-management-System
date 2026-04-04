import React from "react";
import { Navigate } from "react-router-dom";
import useAuthentication from "../hooks/auth";

function PublicAuthGuard({ children }) {
  const { isAuthenticated } = useAuthentication();

  if (isAuthenticated) {
    return <Navigate to="/customer/dashboard" />;
  } else {
    return children;
  }
}

export default PublicAuthGuard;
