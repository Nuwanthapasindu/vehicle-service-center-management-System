import React from 'react';
import useAuthentication from '../../../hooks/auth';
import './CustomerHeader.css';

const CustomerHeader = ({ title }) => {
    const { profile } = useAuthentication();

    // Get current date in a readable format in the user's local timezone
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const userName = profile?.name || 'Customer';
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8EDB00&color=1A1D23`;

    return (
        <header className="customer-header">
            <div className="header-left">
                <h1 className="header-title">{title || 'Customer Dashboard'}</h1>
            </div>

            <div className="header-center">
                <div className="date-info">
                    <i className="fa-regular fa-calendar"></i>
                    <span>{currentDate}</span>
                </div>
            </div>

            <div className="header-right">
                <div className="user-profile">
                    <span className="user-name">{userName}</span>
                    <div className="user-avatar">
                        <img src={userAvatar} alt="User Avatar" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CustomerHeader;
