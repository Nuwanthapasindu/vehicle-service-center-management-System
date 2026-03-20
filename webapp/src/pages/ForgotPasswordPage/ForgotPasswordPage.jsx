import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
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
                            Enter your registered email or mobile number. We'll send you a code to reset your password.
                        </p>

                        <form className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="recovery-contact">Email or Mobile Number</label>
                                <div className="input-wrapper">
                                    <i className="fa-regular fa-user input-icon"></i>
                                    <input
                                        type="text"
                                        id="recovery-contact"
                                        placeholder="e.g. alex@example.com"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="forgot-password-submit-btn">
                                <span>Send Recovery Code</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>

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
