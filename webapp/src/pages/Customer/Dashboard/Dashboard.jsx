import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import useAuthentication from '../../../hooks/auth';
import getImageUrl from '../../../util/getImageUrl';
import { formatDate, formatLongDate, formatShortDate } from '../../../util/dateFormatter';
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
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = dashboardData?.stats || {
        activeBookings: 0,
        totalVehicles: 0,
        totalBookings: 0,
        totalSpent: "LKR0.00"
    };

    const upcoming = dashboardData?.upcomingBooking;

    if (loading) {
        return (
            <CustomerLayout title="Customer Dashboard">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <i className="fa-solid fa-spinner fa-spin fa-3x" style={{ color: 'var(--primary-color)' }}></i>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout title="Customer Dashboard">
            {/* Welcome Section */}
            <section className="welcome-greeting">
                <div className="greeting-text">
                    <h2 className="greeting">Good morning, {userName}</h2>
                    <p className="greeting-msg">
                        {upcoming ? (
                            <>Your <span className="highlight">{upcoming.vehicle}</span> is scheduled for a service soon.</>
                        ) : (
                            <>You have no upcoming services scheduled.</>
                        )}
                    </p>
                </div>
                <div className="global-actions">
                    <Link to="/customer/service-booking" className="book-btn" style={{ textDecoration: 'none' }}>
                        <i className="fa-regular fa-calendar-check"></i>
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
                        <h4 className="section-title">My Garage</h4>
                        <Link to="/customer/my-garage" className="view-all-btn" style={{ textDecoration: 'none' }}>View All</Link>
                    </div>
                    <div className="vehicle-list">
                        {dashboardData?.recentVehicles?.length > 0 ? (
                            dashboardData.recentVehicles.map((vehicle) => (
                                <Link to={`/customer/my-garage/${vehicle._id}`} className="vehicle-item-card" key={vehicle._id} style={{ textDecoration: 'none' }}>
                                    <div className="vehicle-image">
                                        <img src={getImageUrl(vehicle.image?.filePath)} alt={vehicle.model} />
                                    </div>
                                    <div className="vehicle-details">
                                        <h5 className="vehicle-name">{vehicle.make} {vehicle.model}</h5>
                                        <span className="vehicle-year">{vehicle.licensePlate}</span>
                                    </div>
                                    <div className="service-status">
                                        <span className="dot"></span>
                                        <span>{vehicle.type}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="empty-state">No vehicles in garage.</div>
                        )}
                    </div>
                </div>

                {/* Upcoming Section */}
                <div className="dashboard-section upcoming-section">
                    <h4 className="section-title">Upcoming</h4>
                    {upcoming ? (
                        <div className="upcoming-booking-card">
                            <div className="card-header">
                                <div className="service-icon-box">
                                    <i className="fa-solid fa-spray-can-sparkles"></i>
                                </div>
                                <div className="service-name-box">
                                    <h5 className="service-title">{upcoming.service}</h5>
                                    <span className="service-vehicle">{upcoming.vehicle}</span>
                                </div>
                                <span className="status-badge">{upcoming.status}</span>
                            </div>
                            <div className="card-body">
                                <div className="booking-info-item">
                                    <i className="fa-regular fa-calendar"></i>
                                    <span>{formatLongDate(upcoming.date)}</span>
                                </div>
                                <div className="booking-info-item">
                                    <i className="fa-regular fa-clock"></i>
                                    <span>{upcoming.time}</span>
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
                        <div className="empty-state upcoming-empty">
                            <i className="fa-regular fa-calendar-xmark"></i>
                            <p>No upcoming appointments</p>
                            <Link to="/customer/service-booking" className="book-inline-btn">Book Now</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Service History Preview */}
            <section className="dashboard-section table-section">
                <div className="section-header">
                    <h4 className="section-title">Service History Preview</h4>
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
                                            <span className={`status-pill ${item.status.toLowerCase() === 'finish' ? 'completed' : item.status.toLowerCase() === 'start' ? 'progress' : 'pending'}`}>
                                                {item.status === 'FINISH' ? 'COMPLETED' : item.status === 'START' ? 'IN PROGRESS' : item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state">No service history yet.</div>
                    )}
                </div>
            </section>
        </CustomerLayout>
    );
};

export default Dashboard;
