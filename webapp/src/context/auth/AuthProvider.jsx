import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../store/slices/authSlice";
import { CONFIGURATION } from "../../constants/enum";
import  AuthContext  from "./AuthContext";

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const logout = useCallback(() => {
        localStorage.removeItem(CONFIGURATION.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(CONFIGURATION.ACCESS_TOKEN_KEY);
        dispatch(setToken(null));
        dispatch(setUser(null));
        navigate("/login");
    }, [dispatch, navigate]);

    const memorizedContext = useMemo(() => ({
        isAuthenticated: !!user,
        profile: user,
        logout,
    }), [user, logout]);

    return (
        <AuthContext.Provider value={memorizedContext}>
            {children}
        </AuthContext.Provider>
    )
}