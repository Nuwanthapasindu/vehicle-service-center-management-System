import React from "react";

const initialAuthConfiguration = {
    isAuthenticated: false,
    profile: null,
    logout: () => { },
};
 const AuthContext = React.createContext(initialAuthConfiguration);

 export default AuthContext