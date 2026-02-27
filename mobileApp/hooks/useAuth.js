import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthentication = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthentication must be used within an AuthProvider");
  }

  return context;
};

export default useAuthentication;
