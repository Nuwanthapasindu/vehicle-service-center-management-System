import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './Profile.css';
import useAuthentication from '../../../hooks/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/slices/authSlice';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { profileValidationSchema } from '../../../schemas/user';

const Profile = () => {
    const { profile } = useAuthentication();
    const dispatch = useDispatch();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            phoneNumber: '',
            address: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: profileValidationSchema,
        onSubmit: async (values) => {
            // Build payload with mandatory fields
            const payload = {
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                address: values.address,
            };
            // Include newPassword only if user entered it (and validation ensures it matches confirmPassword)
            if (values.newPassword && values.newPassword.length > 0) {
                payload.newPassword = values.newPassword;
                payload.currentPassword = values.currentPassword;
            }
            try {
                const response = await axios.put('/user/profile', payload);
                toast.success(response.data.payload.message || 'Profile updated successfully!');
                dispatch(setUser(response.data.payload.user));

                // Clear password fields after successful update
                formik.setFieldValue('currentPassword', '');
                formik.setFieldValue('newPassword', '');
                formik.setFieldValue('confirmPassword', '');
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || 'Failed to update profile');
            }
        }
    });

    useEffect(() => {
        if (profile) {
            formik.setValues({
                fullName: profile.name || '',
                phoneNumber: profile.mobile || '',
                address: profile.address || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [profile]);

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
                        <Link to="/customer/dashboard">
                            <i className="fa-solid fa-house"></i>
                            Dashboard
                        </Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Profile Details</span>
                    </nav>

                    {/* Page Header */}
                    <section className="page-title-section">
                        <div className="title-text">
                            <h1 className="page-title">Profile Settings</h1>
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

                        <form className="settings-form" onSubmit={formik.handleSubmit}>

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
                                            name="fullName"
                                            value={formik.values.fullName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your full name"
                                            className={formik.touched.fullName && formik.errors.fullName ? 'error' : ''}
                                        />
                                        {formik.touched.fullName && formik.errors.fullName && (
                                            <span className="field-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.fullName}</span>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phoneNumber">Phone Number</label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your phone number"
                                            className={formik.touched.phoneNumber && formik.errors.phoneNumber ? 'error' : ''}
                                        />
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                            <span className="field-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.phoneNumber}</span>
                                        )}
                                    </div>
                                    <div className="form-group full-width">
                                        <label htmlFor="address">Address</label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            placeholder="Enter your address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.address && formik.errors.address ? 'error' : ''}
                                        ></textarea>
                                        {formik.touched.address && formik.errors.address && (
                                            <span className="field-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.address}</span>
                                        )}
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
                                                name="currentPassword"
                                                value={formik.values.currentPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Enter your current password"
                                                className={formik.touched.currentPassword && formik.errors.currentPassword ? 'error' : ''}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                <i className={`fa-regular ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                        {formik.touched.currentPassword && formik.errors.currentPassword && (
                                            <span className="field-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.currentPassword}</span>
                                        )}
                                        <p className="password-hint">Verification is required before changing password.</p>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                id="newPassword"
                                                name="newPassword"
                                                value={formik.values.newPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Enter at least 8 characters"
                                                className={formik.touched.newPassword && formik.errors.newPassword ? 'error' : ''}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                        {formik.touched.newPassword && formik.errors.newPassword && (
                                            <span className="field-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.newPassword}</span>
                                        )}
                                        <p className="password-hint">Must include uppercase, number and symbol.</p>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Retype your new password"
                                                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                            <span className="field-error" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{formik.errors.confirmPassword}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={formik.isSubmitting || !formik.isValid}>
                                    {formik.isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
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

