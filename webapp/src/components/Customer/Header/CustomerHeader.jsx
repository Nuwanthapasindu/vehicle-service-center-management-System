import React from 'react';
import './CustomerHeader.css';

const CustomerHeader = ({ title }) => {
    return (
        <header className="customer-header">
            <div className="header-left">
                <h1 className="header-title">{title || 'Customer Dashboard'}</h1>
            </div>

            <div className="header-center">
                <div className="date-info">
                    <i className="fa-regular fa-calendar"></i>
                    <span>October 24, 2023</span>
                </div>
            </div>

            <div className="header-right">
                <div className="user-profile">
                    <span className="user-name">Alex Henderson</span>
                    <div className="user-avatar">
                        <img src="https://ui-avatars.com/api/?name=Alex+Henderson&background=8EDB00&color=1A1D23" alt="User Avatar" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CustomerHeader;
