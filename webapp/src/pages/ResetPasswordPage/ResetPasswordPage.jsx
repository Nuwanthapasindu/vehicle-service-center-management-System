import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                            Choose a strong, unique password to protect your detailing management dashboard.
                        </p>

                        <form className="reset-password-form">
                            <div className="form-group">
                                <label htmlFor="new-password">NEW PASSWORD</label>
                                <div className="input-wrapper">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="new-password"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Security Score Box */}
                            <div className="security-score-box">
                                <div className="security-score-header">
                                    <span className="score-label">SECURITY SCORE</span>
                                    <span className="score-value strong">STRONG</span>
                                </div>
                                <div className="security-score-bars">
                                    <div className="score-bar filled"></div>
                                    <div className="score-bar filled"></div>
                                    <div className="score-bar filled"></div>
                                    <div className="score-bar empty"></div>
                                </div>
                                <div className="security-score-hint">
                                    <i className="fa-solid fa-circle-info"></i>
                                    <span>Use at least 8 characters, including a number and a special symbol.</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
                                <div className="input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirm-password"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="reset-password-submit-btn">
                                <span>UPDATE PASSWORD</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>

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
