import React from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuthentication() {
  return React.useContext(AuthContext);
}