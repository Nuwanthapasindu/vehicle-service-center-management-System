import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './Profile.css';
import useAuthentication from '../../../hooks/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/slices/authSlice';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
    const { profile } = useAuthentication();
    const dispatch = useDispatch();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validationSchema = Yup.object({
        fullName: Yup.string().required("Full name is required"),
        phoneNumber: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required"),
        address: Yup.string().required("Address is required"),
        currentPassword: Yup.string(),
        newPassword: Yup.string()
            .when('currentPassword', {
                is: (val) => val && val.length > 0,
                then: (schema) => schema
                    .required("New password is required to change password")
                    .min(8, "Password must be at least 8 characters")
                    .matches(passwordRules, "Password must include uppercase, number and symbol"),
                otherwise: (schema) => schema.notRequired()
            })
    });

    const formik = useFormik({
        initialValues: {
            fullName: '',
            phoneNumber: '',
            address: '',
            currentPassword: '',
            newPassword: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            setStatus({ type: '', message: '' });
            try {
                const response = await axios.put('/user/profile', values);
                setStatus({ type: 'success', message: 'Profile updated successfully!' });
                dispatch(setUser(response.data.payload.user));
                
                formik.setFieldValue('currentPassword', '');
                formik.setFieldValue('newPassword', '');
            } catch (error) {
                setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile' });
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
                newPassword: ''
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

                        <form className="settings-form" onSubmit={formik.handleSubmit}>
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
                                            name="fullName"
                                            value={formik.values.fullName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your full name"
                                            className={formik.touched.fullName && formik.errors.fullName ? 'error' : ''}
                                        />
                                        {formik.touched.fullName && formik.errors.fullName && (
                                            <span className="field-error" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{formik.errors.fullName}</span>
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
                                            <span className="field-error" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{formik.errors.phoneNumber}</span>
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
                                            <span className="field-error" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{formik.errors.address}</span>
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
                                        {formik.touched.currentPassword && formik.errors.currentPassword && (
                                            <span className="field-error" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{formik.errors.currentPassword}</span>
                                        )}
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
                                        {formik.touched.newPassword && formik.errors.newPassword && (
                                            <span className="field-error" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{formik.errors.newPassword}</span>
                                        )}
                                        <p className="password-hint">Must include uppercase, number and symbol.</p>
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

