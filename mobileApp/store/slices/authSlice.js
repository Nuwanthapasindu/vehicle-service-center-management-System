import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import storageKeys from "../../constants/storageKeys";
import useSecureStorage from "../../hooks/useSecureStorage";
import enums from "../../constants/enums";
import Toast from "react-native-toast-message";
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
  const {saveItem,deleteItem} = useSecureStorage();
  const { setUser, setToken } = authSlice.actions;
  try {
    if (personalAccessToken) {
      dispatch(setToken(personalAccessToken));
      await saveItem(storageKeys.PERSONAL_ACCESS_TOKEN, personalAccessToken);
      const response = await axios.get("/auth/me");
      const userRole = response.data.payload?.authenticatedUser?.role;
      if(userRole === enums.USER_ROLES.ADMIN || userRole === enums.USER_ROLES.MECHANIC){
        dispatch(setUser(response.data.payload?.authenticatedUser));
      }else{
        Toast.show({
          type: "error",
          text1: "You are not authorized to access this application",
        });
        await deleteItem(storageKeys.PERSONAL_ACCESS_TOKEN);
        await deleteItem(storageKeys.REFRESH_TOKEN);
        dispatch(setToken(null));
        dispatch(setUser(null));
      }
    } else {
      await deleteItem(storageKeys.PERSONAL_ACCESS_TOKEN);
      await deleteItem(storageKeys.REFRESH_TOKEN);
      dispatch(setToken(null));
      dispatch(setUser(null));
    }
  } catch (error) {
    await deleteItem(storageKeys.PERSONAL_ACCESS_TOKEN);
    await deleteItem(storageKeys.REFRESH_TOKEN);
    dispatch(setToken(null));
    dispatch(setUser(null));
  }
};

// EXPORT ACTIONS AND REDUCER
export default authSlice.reducer;