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

// Import Localized Font and Icons
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

storeSubscribe();
tokenRefresh();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Router />
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
