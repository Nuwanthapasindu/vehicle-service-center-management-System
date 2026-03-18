import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { enums, CONFIGURATION } from "../../../constants/enum";
import "./OTPVerificationPage.css";

function OTPVerificationPage() {
  // Server expects 6 digits (per auth.validation.js)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Input Change Handler
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    // Take the last character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input automatically if a digit was entered
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Backspace, Delete, Right, Left arrow key handler
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle Paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);

    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);

      const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
      inputRefs[nextIndex].current.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      toast.warning("Please enter the full 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/auth/verification", {
        otp: otpCode,
      });

      toast.success(response?.data?.payload?.message || "Account verified!");
      localStorage.removeItem(CONFIGURATION.MOBILE_NUMBER_KEY);
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message ||
        error?.response?.data?.message ||
        enums.DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    const mobile = localStorage.getItem(CONFIGURATION.MOBILE_NUMBER_KEY);
    if (!mobile) {
      toast.error("Mobile number not found. Please register again.");
      navigate("/register");
      return;
    }

    try {
      const response = await axios.post("/auth/verification/resend", {
        mobile: mobile,
      });

      toast.success(response?.data?.payload?.message || "OTP resent!");
    } catch (error) {
      const message =
        error?.response?.data?.payload?.message ||
        error?.response?.data?.message ||
        enums.DEFAULT_ERROR_MESSAGE;
      toast.error(message);
    }
  };

  return (
    <div className="otp-page-wrapper">
      <Header />
      <main className="otp-main">
        <div className="otp-card">
          <div className="otp-card-header">
            <div className="otp-icon-wrapper">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>
          </div>

          <div className="otp-card-body">
            <h2 className="otp-title">Verify Your Number</h2>
            <p className="otp-subtitle">
              We've sent a 6-digit verification code to your mobile.
            </p>

            <form className="otp-form" onSubmit={handleVerify}>
              <div className="otp-inputs-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    ref={inputRefs[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`otp-input ${digit ? "filled" : ""}`}
                    placeholder="-"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="otp-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            <div className="otp-footer-actions">
              <button
                className="resend-btn"
                onClick={handleResend}
                type="button"
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OTPVerificationPage;
