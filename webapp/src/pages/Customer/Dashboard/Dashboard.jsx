import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import useAuthentication from '../../../hooks/auth';
import RecentVehicleCard from '../../../components/Customer/Dashboard/RecentVehicleCard';
import { formatDate, formatLongDate, formatShortDate } from '../../../util/dateFormatter';
import { getStatusClass, getStatusText } from '../../../util/statusFormatter';
import { enums } from '../../../constants/enum';
import './Dashboard.css';

const Dashboard = () => {
    const { profile } = useAuthentication();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    const userName = profile?.name || 'Customer';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/booking/dashboard');
                setDashboardData(response.data.payload.data);
            } catch (error) {
                toast.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = {
        activeBookings: dashboardData?.stats?.activeBookings ?? 0,
        totalVehicles: dashboardData?.stats?.totalVehicles ?? 0,
        totalBookings: dashboardData?.stats?.totalBookings ?? 0,
        totalSpent: dashboardData?.stats?.totalSpent ?? "LKR 0.00"
    };

    const upcoming = dashboardData?.upcomingBooking;

    if (loading) {
        return (
            <CustomerLayout title="Customer Dashboard">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
                    <div className="loading-state-container">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Loading your profile...</p>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout title="Customer Dashboard">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <span className="active">
                    <i className="fa-solid fa-house"></i> Dashboard
                </span>
            </nav>

            {/* Welcome Section */}
            <section className="page-title-section welcome-greeting">
                <div className="greeting-text">
                    <h1 className="page-title">Good morning, {userName}</h1>
                    <p className="page-subtitle greeting-msg">
                        {upcoming ? (
                            <>Your <span className="highlight">{upcoming.vehicle || 'Vehicle'}</span> is scheduled for a service soon.</>
                        ) : (
                            <>You have no upcoming services scheduled.</>
                        )}
                    </p>
                </div>
                <div className="global-actions">
                    <Link to="/customer/service-booking" className="book-btn" style={{ textDecoration: 'none' }}>
                        <i className="fa-solid fa-calendar-check"></i>

                        <span>BOOK NOW</span>
                    </Link>
                    <Link to="/customer/my-garage/add" className="add-btn">
                        <i className="fa-solid fa-circle-plus"></i>
                        <span>ADD VEHICLE</span>
                    </Link>
                </div>
            </section>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">ACTIVE BOOKINGS</span>
                        <h3 className="stat-value">{stats.activeBookings}</h3>
                        <p className="stat-description">
                            {upcoming ? `Next: ${formatDate(upcoming.date)}` : "No upcoming service"}
                        </p>
                    </div>
                    <div className="stat-icon-bg">
                        <i className="fa-regular fa-calendar-days"></i>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">MY GARAGE</span>
                        <h3 className="stat-value">{stats.totalVehicles} <span className="badge">Active</span></h3>
                        <p className="stat-description">Total registered vehicles</p>
                    </div>
                    <div className="stat-icon-bg">
                        <i className="fa-solid fa-car"></i>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">SUMMARY</span>
                        <h3 className="stat-value">{stats.totalBookings < 10 ? `0${stats.totalBookings}` : stats.totalBookings}</h3>
                        <p className="stat-description">Total Bookings</p>
                    </div>
                    <div className="stat-icon-bg">
                        <i className="fa-solid fa-tags"></i>
                    </div>
                </div>

                <div className="stat-card total-spent-card">
                    <div className="stat-info">
                        <span className="stat-label">TOTAL SPENT</span>
                        <h3 className="stat-value">{stats.totalSpent}</h3>
                        <p className="stat-description">Lifetime service value</p>
                    </div>
                </div>
            </div>

            {/* Secondary Grid (Garage and Upcoming) */}
            <div className="secondary-grid">
                {/* My Garage Preview */}
                <div className="dashboard-section garage-preview-section">
                    <div className="section-header">
                        <h2 className="section-title">My Garage</h2>
                        <Link to="/customer/my-garage" className="view-all-btn" style={{ textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div className="vehicle-list">
                        {dashboardData?.recentVehicles?.length > 0 ? (
                            dashboardData.recentVehicles.map((vehicle) => (
                                <RecentVehicleCard key={vehicle._id} vehicle={vehicle} />
                            ))
                        ) : (
                            <div className="empty-state-container">
                                <div className="empty-state-icon">
                                    <i className="fa-solid fa-car-side"></i>
                                </div>
                                <p className="empty-state-text">No records found.</p>
                                <Link to="/customer/my-garage/add" className="empty-state-btn">Add Vehicle</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Section */}
                <div className="dashboard-section upcoming-section">
                    <h2 className="section-title">Upcoming</h2>
                    {upcoming ? (
                        <div className="upcoming-booking-card">
                            <div className="card-header">
                                <div className="service-icon-box">
                                    <i className="fa-solid fa-spray-can"></i>

                                </div>
                                <div className="service-name-box">
                                    <h5 className="service-title">{upcoming.service || 'Service'}</h5>
                                    <span className="service-vehicle">{upcoming.vehicle || 'Vehicle'}</span>
                                </div>
                                <span className="status-badge">{upcoming.status || 'Status'}</span>
                            </div>
                            <div className="card-body">
                                <div className="booking-info-item">
                                    <i className="fa-regular fa-calendar"></i>
                                    <span>{formatLongDate(upcoming.date)}</span>
                                </div>
                                <div className="booking-info-item">
                                    <i className="fa-regular fa-clock"></i>
                                    <span>{upcoming.time || 'TBD'}</span>
                                </div>
                                <div className="booking-info-item">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <span>Main Facility</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <Link to="/customer/service-history" className="manage-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>View Details</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state-container">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-calendar-xmark"></i>
                            </div>
                            <p className="empty-state-text">No upcoming appointments</p>
                            <Link to="/customer/service-booking" className="empty-state-btn">Book Now</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Service History Preview */}
            <section className="dashboard-section table-section">
                <div className="section-header">
                    <h2 className="section-title">Service History Preview</h2>
                    <Link to="/customer/service-history" className="view-link">View Full History</Link>
                </div>
                <div className="table-container">
                    {dashboardData?.recentHistory?.length > 0 ? (
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>VEHICLE</th>
                                    <th>SERVICE</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.recentHistory.map((item) => (
                                    <tr key={item.id}>
                                        <td className="date-cell">
                                            {formatShortDate(item.date)}
                                        </td>
                                        <td className="vehicle-cell">{item.vehicle}</td>
                                        <td>{item.service}</td>
                                        <td>
                                            <span className={`status-pill ${getStatusClass(item.status)}`}>
                                                {getStatusText(item.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state-container">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-clock-rotate-left"></i>
                            </div>
                            <p className="empty-state-text">No service history yet.</p>
                            <Link to="/customer/service-booking" className="empty-state-btn">Book Your First Service</Link>
                        </div>
                    )}
                </div>
            </section>
        </CustomerLayout>
    );
};

export default Dashboard;
