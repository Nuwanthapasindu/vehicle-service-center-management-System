import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuthentication from '../../../hooks/auth';
import './CustomerSidebar.css';

const Sidebar = () => {
    const { logout } = useAuthentication();
    const [isOpen, setIsOpen] = useState(false);

    const onToggle = () => setIsOpen(!isOpen);

    return (
        <aside className={`customer-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand">
                <button className={`mobile-toggle-btn ${isOpen ? 'close-mode' : 'menu-mode'}`} onClick={onToggle}>
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>
                <img src="/logo.jpeg" alt="Shine Depot Logo" className="brand-logo-img" />
                <div className="brand-text">
                    <span className="brand-name">SHINE DEPOT</span>
                    <span className="brand-tagline">PROFESSIONAL DETAILING</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/customer/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <i className="fa-solid fa-table-columns"></i>
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to="/customer/service-booking"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Service Booking</span>
                </NavLink>
                <NavLink
                    to="/customer/my-garage"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <i className="fa-solid fa-car-side"></i>
                    <span>My Garage</span>
                </NavLink>
                <NavLink
                    to="/customer/service-history"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <i className="fa-solid fa-history"></i>
                    <span>Service History</span>
                </NavLink>
                <NavLink
                    to="/customer/profile"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <i className="fa-regular fa-user-circle"></i>
                    <span>Profile</span>
                </NavLink>
                <NavLink
                    to="/customer/reviews"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Review</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="attention-box">
                    <span className="attention-label">ATTENTION</span>
                    <p className="attention-text">
                        In the event of non-use, please log out of the system to ensure data security.
                    </p>
                    <button className="logout-btn" onClick={logout}>LOG OUT</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
