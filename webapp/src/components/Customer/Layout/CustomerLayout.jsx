import React, { useState } from 'react';
import Sidebar from '../SideBar/CustomerSidebar';
import Header from '../Header/CustomerHeader';
import './CustomerLayout.css';

const CustomerLayout = ({ children, title }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="customer-portal-wrapper">
            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            <div className="customer-content-area">
                <Header title={title} />
                <main className="dashboard-main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;
