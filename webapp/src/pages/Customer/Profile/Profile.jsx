import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './Profile.css';
import useAuthentication from '../../../hooks/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/slices/authSlice';
import axios from 'axios';

const Profile = () => {
    const { profile } = useAuthentication();
    const dispatch = useDispatch();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        currentPassword: '',
        newPassword: ''
    });

    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                fullName: profile.name || '',
                phoneNumber: profile.mobile || '',
                address: profile.address || ''
            }));
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsLoading(true);

        try {
            const response = await axios.put('/user/profile', formData);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            dispatch(setUser(response.data.payload.user));

            // clear passwords
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: ''
            }));
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const userName = profile?.name || 'Customer';
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8EDB00&color=1A1D23`;

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="My Profile" />

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
                                <img src={userAvatar} alt="User Avatar" />
                            </div>
                            <div className="user-meta-info">
                                <h3 className="user-name">{userName}</h3>
                                <p className="user-role">{profile?.role || 'Customer'}</p>
                            </div>
                        </div>

                        <form className="settings-form" onSubmit={handleSubmit}>
                            {status.message && (
                                <div className={`status-message ${status.type}`} style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: status.type === 'error' ? '#f8d7da' : '#d4edda', color: status.type === 'error' ? '#721c24' : '#155724' }}>
                                    {status.message}
                                </div>
                            )}

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
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label htmlFor="address">Address</label>
                                        <textarea
                                            id="address"
                                            placeholder="Enter your address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
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
                                                value={formData.currentPassword}
                                                onChange={handleChange}
                                                placeholder="Leave blank to keep current"
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
                                                value={formData.newPassword}
                                                onChange={handleChange}
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
                                <button type="submit" className="save-btn" disabled={isLoading}>
                                    {isLoading ? 'SAVING...' : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </form>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Profile;

