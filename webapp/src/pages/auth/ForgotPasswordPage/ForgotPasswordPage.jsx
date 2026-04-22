import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { CONFIGURATION, enums } from "../../../constants/enum";
import { forgotPasswordValidationSchema } from "../../../schemas/auth";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const initialValues = {
    mobile: "",
  };

  const handleSendCode = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/auth/forgotPassword", {
        mobile: values.mobile.trim(),
      });

      toast.success(
        response?.data?.payload?.message || "Recovery code sent via SMS!",
      );

      localStorage.setItem(CONFIGURATION.MOBILE_NUMBER_KEY, values.mobile);
      // Redirect to reset password page
      navigate("/reset-password");
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

  return (
    <div className="forgot-password-page-wrapper">
      <Header />
      <main className="forgot-password-main">
        <div className="forgot-password-card">
          <div className="forgot-password-card-header">
            <div className="forgot-password-icon-wrapper">
              <i className="fa-solid fa-clock-rotate-left"></i>
              <div className="lock-icon-badge">
                <i className="fa-solid fa-lock"></i>
              </div>
            </div>
          </div>

          <div className="forgot-password-card-body">
            <h2 className="forgot-password-title">Forgot Password?</h2>
            <p className="forgot-password-subtitle">
              Enter your registered mobile number. We'll send you a 6-digit code
              to reset your password.
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleSendCode}
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
                  <Form className="forgot-password-form" noValidate>
                    <div className="form-group">
                      <label htmlFor="mobile">Mobile Number</label>
                      <div className={`input-wrapper ${fieldClass("mobile")}`}>
                        <i className="fa-solid fa-phone input-icon"></i>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          placeholder="e.g. 0771234567"
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

                    <button
                      type="submit"
                      className="forgot-password-submit-btn"
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Recovery Code</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </Form>
                );
              }}
            </Formik>

            <div className="forgot-password-footer">
              <Link to="/login" className="back-to-login-link">
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;
