import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <CustomerLayout title="Customer Dashboard">
            {/* Welcome Section */}
            <section className="welcome-greeting">
                <div className="greeting-text">
                    <h2 className="greeting">Good morning, Alex!</h2>
                    <p className="greeting-msg">
                        Your <span className="highlight">Porsche 911 GT3</span> is due for a ceramic coating refresh.
                    </p>
                </div>
                <div className="global-actions">
                    <button className="book-btn">
                        <i className="fa-regular fa-calendar-check"></i>
                        <span>BOOK NOW</span>
                    </button>
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
                        <h3 className="stat-value">2</h3>
                        <p className="stat-description">Next: Tomorrow at 10:00 AM</p>
                    </div>
                    <div className="stat-icon-bg">
                        <i className="fa-regular fa-calendar-days"></i>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">MY GARAGE</span>
                        <h3 className="stat-value">3 <span className="badge">Active</span></h3>
                        <p className="stat-description">Total registered vehicles</p>
                    </div>
                    <div className="stat-icon-bg">
                        <i className="fa-solid fa-car"></i>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">SUMMARY</span>
                        <h3 className="stat-value">05</h3>
                        <p className="stat-description">Total Bookings</p>
                    </div>
                    <div className="stat-icon-bg">
                        <i className="fa-solid fa-tags"></i>
                    </div>
                </div>

                <div className="stat-card total-spent-card">
                    <div className="stat-info">
                        <span className="stat-label">TOTAL SPENT</span>
                        <h3 className="stat-value">$2,450</h3>
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
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="vehicle-list">
                        {[1, 2].map((i) => (
                            <div className="vehicle-item-card" key={i}>
                                <div className="vehicle-image">
                                    <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80" alt="Porsche 911 GT3" />
                                </div>
                                <div className="vehicle-details">
                                    <h5 className="vehicle-name">Porsche 911 GT3</h5>
                                    <span className="vehicle-year">2023</span>
                                </div>
                                <div className="service-status">
                                    <span className="dot"></span>
                                    <span>Last Service: Oct 10</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Section */}
                <div className="dashboard-section upcoming-section">
                    <h4 className="section-title">Upcoming</h4>
                    <div className="upcoming-booking-card">
                        <div className="card-header">
                            <div className="service-icon-box">
                                <i className="fa-solid fa-spray-can-sparkles"></i>
                            </div>
                            <div className="service-name-box">
                                <h5 className="service-title">Platinum Interior Detail</h5>
                                <span className="service-vehicle">Porsche 911 GT3</span>
                            </div>
                            <span className="status-badge">CONFIRMED</span>
                        </div>
                        <div className="card-body">
                            <div className="booking-info-item">
                                <i className="fa-regular fa-calendar"></i>
                                <span>Friday, Oct 25, 2023</span>
                            </div>
                            <div className="booking-info-item">
                                <i className="fa-regular fa-clock"></i>
                                <span>10:00 AM - 1:00 PM</span>
                            </div>
                            <div className="booking-info-item">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>Main Facility, Bay 4</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="manage-btn">Manage Booking</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service History Preview */}
            <section className="dashboard-section table-section">
                <div className="section-header">
                    <h4 className="section-title">Service History Preview</h4>
                    <a href="/customer/service-history" className="view-link">View Full History</a>
                </div>
                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>VEHICLE</th>
                                <th>SERVICE</th>
                                <th>COST</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="date-cell">Oct 10, 2023</td>
                                <td className="vehicle-cell">Porsche 911 GT3</td>
                                <td>Full Exterior Wash + Wax</td>
                                <td className="cost-cell">LKR18,500.00</td>
                                <td><span className="status-pill completed">COMPLETED</span></td>
                            </tr>
                            <tr>
                                <td className="date-cell">Sep 24, 2023</td>
                                <td className="vehicle-cell">BMW X5</td>
                                <td>Interior Deep Clean</td>
                                <td className="cost-cell">LKR240.00</td>
                                <td><span className="status-pill completed">COMPLETED</span></td>
                            </tr>
                            <tr>
                                <td className="date-cell">Aug 15, 2023</td>
                                <td className="vehicle-cell">Audi RS6</td>
                                <td>Ceramic Coating Pro</td>
                                <td className="cost-cell">$1,200.00</td>
                                <td><span className="status-pill completed">COMPLETED</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </CustomerLayout>
    );
};

export default Dashboard;
