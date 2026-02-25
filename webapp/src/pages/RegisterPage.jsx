import React, { useState } from "react";
import "../styles/RegisterPage.css";
import axios from "axios";
import { API_BASE } from "../api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    mobile: "",
    email: "",
    password: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [strength] = useState("STRONG");

  const togglePassword = () => {
    setPasswordVisible((prev) => !prev);
  };

  //  handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // fixed register function
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, formData);
      console.log("Registered:", res.data);
      alert("Registration successful!");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

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
            <form onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="input-group-create">
                <span className="icon-left">
                  {/* 👤 icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="input-group-create">
                <span className="icon-left">
                  {/* ☎ icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.12 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username */}
              <div className="input-group-create">
                <span className="icon-left">
                  {/* ⚙️ icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83A2 2 0 0 1 7.04 4l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="User Name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="input-group-create">
                <span className="icon-left">@</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="input-group-create">
                <span className="icon-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
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
                  {passwordVisible ? "🙈" : "👁️"}
                </span>
              </div>

              {/* Password Strength */}
              <div className="password-strength">
                <span className={`strength-text ${strength.toLowerCase()}`}>{strength}</span>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-create-unique">
                Create Account <span>→</span>
              </button>
            </form>

            {/* Footer */}
            <div className="card-footer-create">
              <span>Already have an account?</span>
              <a href="/login">Sign In</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;