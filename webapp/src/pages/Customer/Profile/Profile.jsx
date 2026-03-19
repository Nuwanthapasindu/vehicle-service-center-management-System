import React, { useState } from 'react';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './Profile.css';
import useAuthentication from '../../../hooks/auth';


import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/slices/authSlice';

const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    mobile: Yup.string()
        .matches(/^(?:\+94|94|0)?7[0-8]\d{7}$/, 'Please provide a valid Sri Lankan mobile number')
        .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    currentPassword: Yup.string(),
    newPassword: Yup.string().when('currentPassword', (currentPassword, schema) => {
        if (currentPassword && currentPassword.length > 0 && currentPassword[0]) {
            return schema
                .min(8, 'Password must be at least 8 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/, 'Must include uppercase, lowercase, number and symbol')
                .required('New password is required to change password');
        }
        return schema;
    })
});

const Profile = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { profile } = useAuthentication();
    const dispatch = useDispatch();

    const userName = profile?.name || 'Customer';
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8EDB00&color=1A1D23`;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: profile?.name || '',
            mobile: profile?.mobile || '',
            address: profile?.address || '',
            currentPassword: '',
            newPassword: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setIsSubmitting(true);
            try {
                const response = await axios.put('/auth/profile', values);
                toast.success(response.data?.payload?.message || 'Profile updated successfully!');
                dispatch(setUser(response.data?.payload?.user));
                resetForm({
                    values: {
                        name: response.data.payload.user.name,
                        mobile: response.data.payload.user.mobile,
                        address: response.data.payload.user.address,
                        currentPassword: '',
            			newPassword: ''
                    }
                });
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            } finally {
                setIsSubmitting(false);
                setSubmitting(false);
            }
        }
    });

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
                                <p className="user-role">{profile?.role}</p>
                            </div>
                            <div className="update-status">
                                <span className="status-dot"></span>
                                <span className="status-text">Account Active</span>
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
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your full name"
                                            className={formik.touched.name && formik.errors.name ? 'input-error' : ''}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{formik.errors.name}</div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mobile">Phone Number</label>
                                        <input
                                            type="text"
                                            id="mobile"
                                            name="mobile"
                                            value={formik.values.mobile}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your phone number"
                                            className={formik.touched.mobile && formik.errors.mobile ? 'input-error' : ''}
                                        />
                                        {formik.touched.mobile && formik.errors.mobile && (
                                            <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{formik.errors.mobile}</div>
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
                                            className={formik.touched.address && formik.errors.address ? 'input-error' : ''}
                                        ></textarea>
                                        {formik.touched.address && formik.errors.address && (
                                            <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{formik.errors.address}</div>
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
                                                placeholder="Enter current password if changing"
                                                value={formik.values.currentPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.touched.currentPassword && formik.errors.currentPassword ? 'input-error' : ''}
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
                                            <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{formik.errors.currentPassword}</div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                id="newPassword"
                                                name="newPassword"
                                                placeholder="At least 8 characters"
                                                value={formik.values.newPassword}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.touched.newPassword && formik.errors.newPassword ? 'input-error' : ''}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                        <p className="password-hint">Must include uppercase, lowercase, number and symbol.</p>
                                        {formik.touched.newPassword && formik.errors.newPassword && (
                                            <div className="error-message" style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>{formik.errors.newPassword}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={isSubmitting || !formik.isValid}>
                                    {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
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
