import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { fetchUser } from "../../../store/slices/authSlice";
import { loginValidationSchema } from "../../../schemas/auth";
import { CONFIGURATION } from "../../../constants/enum";
import "./LoginPage.css";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    userName: "",
    password: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/auth/login", values);
      const { accessToken, refreshToken } = response.data.payload;
      localStorage.setItem(CONFIGURATION.REFRESH_TOKEN_KEY, refreshToken);
      dispatch(fetchUser(accessToken));
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message ||
        error?.response?.data?.message ||
        "Invalid username or password";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Header />
      <main className="login-main">
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Access your detailing dashboard</p>
          </div>

          <div className="login-card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
              onSubmit={onSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <Form className="login-form">
                  <div className="form-group">
                    <label htmlFor="userName">User Name</label>
                    <div
                      className={`input-wrapper ${
                        touched.userName && errors.userName ? "input-error" : ""
                      }`}
                    >
                      <i className="fa-regular fa-user input-icon"></i>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        placeholder="Username"
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {touched.userName && errors.userName && (
                      <span className="field-error">{errors.userName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div
                      className={`input-wrapper ${
                        touched.password && errors.password ? "input-error" : ""
                      }`}
                    >
                      <i className="fa-solid fa-lock input-icon"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`fa-regular ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <span className="field-error">{errors.password}</span>
                    )}
                  </div>

                  <div className="forgot-password">
                    <Link to="/forgot-password">Forgotten Password ?</Link>
                  </div>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <span>Login</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="login-card-footer">
              <p>
                Don't you have an account?{" "}
                <Link to="/register" className="signup-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;
