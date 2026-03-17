import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './RegisterPage.css';

function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="register-page-wrapper">
            <Header />
            <main className="register-main">
                <div className="register-card">
                    <div className="register-card-header">
                        <h2 className="register-title">Create Account</h2>
                        <p className="register-subtitle">Join the elite detailing network and manage your vehicle care effortlessly.</p>
                    </div>

                    <div className="register-card-body">
                        <form className="register-form">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <div className="input-wrapper">
                                    <i className="fa-regular fa-user input-icon"></i>
                                    <input type="text" id="fullName" placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobile">Mobile Number</label>
                                <div className="input-wrapper">
                                    <i className="fa-solid fa-phone input-icon"></i>
                                    <input type="tel" id="mobile" placeholder="+1 234 567 890" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">User Name</label>
                                <div className="input-wrapper">
                                    <i className="fa-regular fa-user input-icon"></i>
                                    <input type="text" id="username" placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <i className="fa-solid fa-lock input-icon"></i>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Security Strength Indicator */}
                            <div className="security-strength-container">
                                <div className="security-strength-labels">
                                    <span className="strength-label">SECURITY STRENGTH</span>
                                    <span className="strength-value strong">STRONG</span>
                                </div>
                                <div className="security-strength-bars">
                                    <div className="strength-bar filled"></div>
                                    <div className="strength-bar filled"></div>
                                    <div className="strength-bar filled"></div>
                                    <div className="strength-bar empty"></div>
                                </div>
                            </div>

                            <button type="submit" className="register-submit-btn">
                                <span>Create Account</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>

                        <div className="register-card-footer">
                            <p>Already have an account? <Link to="/login" className="signin-link">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default RegisterPage;
