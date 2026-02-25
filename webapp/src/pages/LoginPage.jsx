import React, { useState } from "react";
import "../styles/LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';

import UserIcon from "../assets/icons/UserIcon";
import LockIcon from "../assets/icons/LockIcon";
import EyeIcon from "../assets/icons/EyeIcon";
import EyeOffIcon from "../assets/icons/EyeOffIcon";

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE}/auth/login`, values);
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="page-wrapper">
      <main className="login-card-main">
        <div className="login-card-unique">
          {/* Top Section */}
          <div className="card-hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1>Welcome Back</h1>
              <p>Access your detailing dashboard</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="card-form-section">
            <form className="login-form-unique" onSubmit={formik.handleSubmit}>
              {/* Email Input */}
              <div className="input-group-unique">
                <span className="icon-left">
                  <UserIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? "input-error" : ""}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="error-text">{formik.errors.email}</div>
              ) : null}

              {/* Password Input */}
              <div className="input-group-unique">
                <span className="icon-left">
                  <LockIcon />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.password && formik.errors.password ? "input-error" : ""}
                />
                <span className="icon-right" onClick={togglePassword}>
                  {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="error-text">{formik.errors.password}</div>
              ) : null}

              {/* Forgot Password */}
              <div className="form-options-unique">
                <a href="#">Forgotten Password ?</a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn-login-unique"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Logging in..." : "Login"} <span>→</span>
              </button>
            </form>

            {/* Footer Sign Up */}
            <div className="card-footer-unique">
              <span>Don't have an account?</span>
              <Link to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;