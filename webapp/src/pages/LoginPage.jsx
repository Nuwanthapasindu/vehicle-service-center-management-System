import React, { useState } from "react";
import "../styles/LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate(); // redirect after login if needed

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fixed login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, formData);
      localStorage.setItem("token", res.data.token);
      console.log("Logged in:", res.data.user);
      alert("Login successful!");
      navigate("/dashboard"); // redirect after login (optional)
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!");
    }
  };

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
            <form className="login-form-unique" onSubmit={handleLogin}>
              {/* Email Input */}
              <div className="input-group-unique">
                <span className="icon-left">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="input-group-unique">
                <span className="icon-left">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="icon-right" onClick={togglePassword}>
                  {passwordVisible ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </span>
              </div>

              {/* Forgot Password */}
              <div className="form-options-unique">
                <a href="#">Forgotten Password ?</a>
              </div>

              {/* Login Button */}
              <button type="submit" className="btn-login-unique">
                Login <span>→</span>
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