import React from "react";
import  AuthContext  from "../context/auth/AuthContext";

export default function useAuthentication() {
  return React.useContext(AuthContext);
}