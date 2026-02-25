import React, { useState } from "react";
import "../styles/RegisterPage.css";
import axios from "axios";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import UserIcon from "../assets/icons/UserIcon";
import PhoneIcon from "../assets/icons/PhoneIcon";
import SettingsIcon from "../assets/icons/SettingsIcon";
import LockIcon from "../assets/icons/LockIcon";
import EyeIcon from "../assets/icons/EyeIcon";
import EyeOffIcon from "../assets/icons/EyeOffIcon";

// Validation Schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  mobile: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .required("Mobile Number is required"),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [strength] = useState("STRONG");
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      mobile: "",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASE}/auth/register`, values);
        console.log("Registered:", res.data);
        toast.success("Registration successful!");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Registration failed!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="page-wrapper">
      <main className="create-card-main">
        <div className="create-card-container">
          {/* Top Section */}
          <div className="card-hero-create">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1>Create Account</h1>
              <p>Join the elite detailing network and manage your vehicle care effortlessly.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="card-form-create">
            <form onSubmit={formik.handleSubmit}>
              {/* Full Name */}
              <div className="input-group-create">
                <span className="icon-left">
                  <UserIcon />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.name && formik.errors.name ? "input-error" : ""}
                />
              </div>
              {formik.touched.name && formik.errors.name ? (
                <div className="error-text">{formik.errors.name}</div>
              ) : null}

              {/* Mobile Number */}
              <div className="input-group-create">
                <span className="icon-left">
                  {/* ☎ icon */}
                  <PhoneIcon />
                </span>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.mobile && formik.errors.mobile ? "input-error" : ""}
                />
              </div>
              {formik.touched.mobile && formik.errors.mobile ? (
                <div className="error-text">{formik.errors.mobile}</div>
              ) : null}

              {/* Username */}
              <div className="input-group-create">
                <span className="icon-left">
                  {/* ⚙️ icon */}
                  <SettingsIcon />
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.username && formik.errors.username ? "input-error" : ""}
                />
              </div>
              {formik.touched.username && formik.errors.username ? (
                <div className="error-text">{formik.errors.username}</div>
              ) : null}

              {/* Email */}
              <div className="input-group-create">
                <span className="icon-left">@</span>
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

              {/* Password */}
              <div className="input-group-create">
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

              {/* Password Strength */}
              <div className="password-strength">
                <span className={`strength-text ${strength.toLowerCase()}`}>{strength}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-create-unique"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating Account..." : "Create Account"} <span>→</span>
              </button>
            </form>

            {/* Footer */}
            <div className="card-footer-create">
              <span>Already have an account?</span>
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;