import React, { useState } from 'react';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './Profile.css';

const Profile = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

                <main className="profile-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <span>Home</span>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Profile Details</span>
                    </nav>

                    {/* Page Header */}
                    <section className="page-title-section">
                        <div className="title-text">
                            <h2 className="page-title">Profile Settings</h2>
                            <p className="page-subtitle">
                                Manage your professional detailing account and security.
                            </p>
                        </div>
                    </section>

                    {/* Settings Form Container */}
                    <div className="profile-settings-card">
                        {/* User Summary Header */}
                        <div className="user-profile-summary">
                            <div className="avatar-placeholder">
                                <img src="https://ui-avatars.com/api/?name=Alex+Johnson&background=F1F5F9&color=64748B&size=128" alt="Alex Johnson" />
                            </div>
                            <div className="user-meta-info">
                                <h3 className="user-name">Alex Johnson</h3>
                                <p className="user-role">Senior Detailer & Shop Manager</p>
                            </div>
                            <div className="update-status">
                                <span className="status-dot"></span>
                                <span className="status-text">Last updated: 2 days ago</span>
                            </div>
                        </div>

                        <form className="settings-form">
                            {/* Personal Information Section */}
                            <div className="form-section">
                                <h4 className="section-title">
                                    <i className="fa-regular fa-user"></i>
                                    PERSONAL INFORMATION
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="fullName">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            defaultValue="Alex Johnson"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            defaultValue="+1 (555) 123-4567"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label htmlFor="address">Address</label>
                                        <textarea
                                            id="address"
                                            placeholder="Enter your address"
                                            defaultValue="N0 23, address Line 01, Line 02, City"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Change Password Section */}
                            <div className="form-section">
                                <h4 className="section-title">
                                    <i className="fa-solid fa-lock"></i>
                                    CHANGE PASSWORD
                                </h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword">Current Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                id="currentPassword"
                                                defaultValue="********"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                <i className={`fa-regular ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                id="newPassword"
                                                placeholder="At least 8 characters"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                        <p className="password-hint">Must include uppercase, number and symbol.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn">SAVE CHANGES</button>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Profile;
