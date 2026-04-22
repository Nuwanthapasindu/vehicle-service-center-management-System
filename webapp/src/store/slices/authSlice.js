import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIGURATION, enums } from "../../constants/enum";
// INITIAL STATE
const initialState = {
  user: null,
  accessToken: null,
};

//  CREATE REDUX SLICE
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

// EXPORT ACTIONS
export const { setUser, setToken } = authSlice.actions;


// DEFINE REDUX THUNK
export const fetchUser = (personalAccessToken) => async (dispatch) => {
  const { setUser, setToken } = authSlice.actions;
  try {
    if (personalAccessToken) {
      sessionStorage.setItem(CONFIGURATION.ACCESS_TOKEN_KEY, personalAccessToken);
      dispatch(setToken(personalAccessToken));
      const response = await axios.get("/auth/me");
      const authenticatedUser = response.data.payload?.authenticatedUser;
      if (authenticatedUser && authenticatedUser.role === enums.USER_ROLES.CUSTOMER) {
        dispatch(setUser(authenticatedUser));
      }else{
        localStorage.removeItem(CONFIGURATION.REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(CONFIGURATION.ACCESS_TOKEN_KEY);
        dispatch(setToken(null));
        dispatch(setUser(null));
      }
    } else {
      localStorage.removeItem(CONFIGURATION.REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(CONFIGURATION.ACCESS_TOKEN_KEY);
      dispatch(setToken(null));
      dispatch(setUser(null));
    }
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    localStorage.removeItem(CONFIGURATION.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(CONFIGURATION.ACCESS_TOKEN_KEY);
    dispatch(setToken(null));
    dispatch(setUser(null));
  }
};

// EXPORT ACTIONS AND REDUCER
export default authSlice.reducer;