import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './LoginPage.css';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-page-wrapper">
            <Header />
            <main className="login-main">
                <div className="login-card">
                    <div className="login-card-header">
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">Access your detailing dashboard</p>
                    </div>

                    <div className="login-card-body">
                        <form className="login-form">
                            <div className="form-group">
                                <label htmlFor="username">User Name</label>
                                <div className="input-wrapper">
                                    <i className="fa-regular fa-user input-icon"></i>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="John Doe"
                                    />
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

                            <div className="forgot-password">
                                <Link to="/forgot-password">Forgotten Password ?</Link>
                            </div>

                            <button type="submit" className="login-submit-btn">
                                <span>Login</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </form>

                        <div className="login-card-footer">
                            <p>Don't you have an account? <Link to="/register" className="signup-link">Sign Up</Link></p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default LoginPage;
