import { Tuple, configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import { thunk } from "redux-thunk";
import axios from "axios";

// REDUX STORE CONFIGURATION
const store = configureStore({
  reducer: {
    auth,
  },
  middleware: () => new Tuple(thunk),
});

export default store;

// STORE SUBSCRIBE TO ADD ACCESS TOKEN TO AXIOS REQUEST
export const storeSubscribe = store.subscribe(() => {
  if (store.getState().auth.accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${
      store.getState().auth.accessToken
    }`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
});