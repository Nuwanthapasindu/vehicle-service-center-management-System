import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { registerValidationSchema } from "../../../schemas/auth";
import { CONFIGURATION, enums } from "../../../constants/enum";
import PasswordStrengthIndicator from "../../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import "./RegisterPage.css";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    mobile: "",
    address: "",
    userName: "",
    password: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/auth/register", {
        name: values.name.trim(),
        mobile: values.mobile.trim(),
        address: values.address.trim(),
        userName: values.userName.trim(),
        password: values.password,
      });

      toast.success(response?.data?.payload?.message);

      // Redirect to OTP verification page
      navigate("/verify-otp");
      localStorage.setItem(CONFIGURATION.MOBILE_NUMBER_KEY, values.mobile);
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message || enums.DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <Header />
      <main className="register-main">
        <div className="register-card">
          <div className="register-card-header">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">
              Join the elite detailing network and manage your vehicle care
              effortlessly.
            </p>
          </div>

          <div className="register-card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={registerValidationSchema}
              onSubmit={onSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
                isValid,
                dirty,
              }) => {
                const fieldClass = (name) =>
                  touched[name] && errors[name] ? "input-error" : "";

                return (
                  <Form className="register-form" noValidate>
                    {/* Full Name */}
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <div className={`input-wrapper ${fieldClass("name")}`}>
                        <i className="fa-regular fa-user input-icon"></i>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      {touched.name && errors.name && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <div className={`input-wrapper ${fieldClass("mobile")}`}>
                        <i className="fa-solid fa-phone input-icon"></i>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          placeholder="0771234567"
                          value={values.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      {touched.mobile && errors.mobile && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <div className={`input-wrapper ${fieldClass("address")}`}>
                        <i className="fa-solid fa-location-dot input-icon"></i>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          placeholder="123 Main Street, Colombo"
                          value={values.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      {touched.address && errors.address && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.address}
                        </span>
                      )}
                    </div>

                    {/* Username */}
                    <div className="form-group">
                      <label htmlFor="userName">Username</label>
                      <div
                        className={`input-wrapper ${fieldClass("userName")}`}
                      >
                        <i className="fa-solid fa-at input-icon"></i>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          placeholder="johndoe123"
                          value={values.userName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      {touched.userName && errors.userName && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.userName}
                        </span>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div
                        className={`input-wrapper ${fieldClass("password")}`}
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
                          aria-label="Toggle password visibility"
                        >
                          <i
                            className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                          ></i>
                        </button>
                      </div>
                      {touched.password && errors.password && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.password}
                        </span>
                      )}
                    </div>

                    {/* Password Strength Indicator */}
                    <PasswordStrengthIndicator password={values.password} />

                    {/* Submit */}
                    <button
                      type="submit"
                      className="register-submit-btn"
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </Form>
                );
              }}
            </Formik>

            <div className="register-card-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="signin-link">
                  Sign In
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

export default RegisterPage;
