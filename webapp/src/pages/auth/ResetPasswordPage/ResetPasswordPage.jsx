import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { enums, CONFIGURATION } from "../../../constants/enum";
import { resetPasswordValidationSchema } from "../../../schemas/auth";
import PasswordStrengthIndicator from "../../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import "./ResetPasswordPage.css";

function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    otp: "",
    password: "",
    confirmPassword: "",
  };

  const handleReset = async (values, { setSubmitting }) => {
    try {
      const response = await axios.put("/auth/reset-password", {
        otp: values.otp.trim(),
        password: values.password,
      });

      toast.success(
        response?.data?.payload?.message || "Password updated successfully!",
      );
      localStorage.removeItem(CONFIGURATION.MOBILE_NUMBER_KEY);
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message ||
        error?.response?.data?.message ||
        enums.DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    const mobile = localStorage.getItem(CONFIGURATION.MOBILE_NUMBER_KEY);
    if (!mobile) {
      toast.error(
        "Mobile number not found. Please try again from forgot password.",
      );
      navigate("/forgot-password");
      return;
    }

    setIsResending(true);
    try {
      const response = await axios.post("/auth/forgotPassword", {
        mobile: mobile,
      });

      toast.success(
        response?.data?.payload?.message || "OTP resent successfully!",
      );
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message ||
        error?.response?.data?.message ||
        enums.DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="reset-password-page-wrapper">
      <Header />
      <main className="reset-password-main">
        <div className="reset-password-card">
          <div className="reset-password-card-header">
            <div className="reset-password-icon-wrapper">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <div className="lock-icon-badge">
                <i className="fa-solid fa-lock"></i>
              </div>
            </div>
          </div>

          <div className="reset-password-card-body">
            <h2 className="reset-password-title">Secure Your Account</h2>
            <p className="reset-password-subtitle">
              Enter the 6-digit code we sent you and set your new password.
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleReset}
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
                  <Form className="reset-password-form" noValidate>
                    <div className="form-group">
                      <label htmlFor="otp">VERIFICATION CODE</label>
                      <div className={`input-wrapper ${fieldClass("otp")}`}>
                        <i className="fa-solid fa-key input-icon"></i>
                        <input
                          type="text"
                          id="otp"
                          name="otp"
                          placeholder="Enter 6-digit code"
                          value={values.otp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <button
                          type="button"
                          className="resend-otp-btn"
                          onClick={handleResendOtp}
                          disabled={isResending}
                        >
                          {isResending ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            "Resend"
                          )}
                        </button>
                      </div>
                      {touched.otp && errors.otp && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.otp}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">NEW PASSWORD</label>
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
                        >
                          <i
                            className={`fa-regular ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
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

                    {/* Security Score Box */}
                    <PasswordStrengthIndicator
                      password={values.password}
                      detailed={true}
                    />

                    <div className="form-group">
                      <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                      <div
                        className={`input-wrapper ${fieldClass("confirmPassword")}`}
                      >
                        <i className="fa-solid fa-lock input-icon"></i>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      {touched.confirmPassword && errors.confirmPassword && (
                        <span className="field-error">
                          <i className="fa-solid fa-circle-exclamation"></i>
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="reset-password-submit-btn"
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <span>UPDATE PASSWORD</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </Form>
                );
              }}
            </Formik>

            <div className="reset-password-footer">
              <Link to="/login" className="back-to-login-link">
                <i className="fa-solid fa-arrow-left"></i>
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ResetPasswordPage;
