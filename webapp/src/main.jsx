import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store, { storeSubscribe } from "./store";
import tokenRefresh from "./services/tokenRefresh";

import AuthProvider from "./context/auth/AuthProvider";
import Router from "./Router.jsx";

import "./assets/css/main.css";
import "./assets/css/variable.css";

import "./services/axios.defaults.js";

storeSubscribe();
tokenRefresh();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <AuthProvider>
        <Router />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
