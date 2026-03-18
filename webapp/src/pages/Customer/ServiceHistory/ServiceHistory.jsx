import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './ServiceHistory.css';

const ServiceHistory = () => {
    const historyData = [
        {
            date: "Oct 10, 2023",
            vehicle: "Porsche 911 GT3",
            service: "Full Exterior Wash + Wax",
            status: "COMPLETED"
        },
        {
            date: "Sep 24, 2023",
            vehicle: "BMW X5",
            service: "Interior Deep Clean",
            status: "COMPLETED"
        },
        {
            date: "Aug 15, 2023",
            vehicle: "Audi RS6",
            service: "Ceramic Coating Pro",
            status: "COMPLETED"
        }
    ];

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Service History" />

                <main className="history-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <Link to="/customer/dashboard">Home</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Booking</span>
                    </nav>

                    {/* Page Title Section */}
                    <section className="page-title-section">
                        <div className="title-text-box">
                            <h2 className="page-title">Service History</h2>
                            <p className="page-subtitle">
                                Manage and review all your professional detailing records in one place.
                            </p>
                        </div>
                        <Link to="/customer/service-booking" className="book-new-btn">
                            <i className="fa-solid fa-circle-plus"></i>
                            <span>BOOK NEW SERVICE</span>
                        </Link>
                    </section>

                    {/* Filter Section */}
                    <div className="filter-card">
                        <div className="search-box">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Search by vehicle, plate or service..." />
                        </div>
                        <div className="select-filters">
                            <div className="filter-select">
                                <select defaultValue="all">
                                    <option value="all">All Vehicles</option>
                                    <option value="porsche">Porsche 911 GT3</option>
                                    <option value="bmw">BMW X5</option>
                                </select>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                            <div className="filter-select">
                                <select defaultValue="6m">
                                    <option value="6m">Date Range: Last 6 Months</option>
                                    <option value="1y">Last Year</option>
                                    <option value="all">All Time</option>
                                </select>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>

                    {/* History Table Card */}
                    <div className="history-table-card">
                        <div className="card-header">
                            <h3 className="card-title">Service History Preview</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>VEHICLE</th>
                                        <th>SERVICE</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="date-cell">{item.date}</td>
                                            <td className="vehicle-cell">{item.vehicle}</td>
                                            <td className="service-cell">{item.service}</td>
                                            <td>
                                                <span className="status-pill completed">{item.status}</span>
                                            </td>
                                            <td>
                                                <button className="details-link-btn">
                                                    Details <i className="fa-solid fa-chevron-right"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Features Grid at Bottom */}
                    <div className="features-info-grid">
                        <div className="feature-info-card certified">
                            <div className="info-icon-box">
                                <i className="fa-solid fa-certificate"></i>
                            </div>
                            <div className="info-text-box">
                                <h4>Certified Detailing</h4>
                                <p>Every service record is cryptographically signed for resale value protection.</p>
                            </div>
                        </div>

                        <div className="feature-info-card">
                            <div className="info-icon-box blue">
                                <i className="fa-regular fa-file-pdf"></i>
                            </div>
                            <div className="info-text-box">
                                <h4>Export History</h4>
                                <p>Download a full PDF report of your vehicle's care history for insurance or sales.</p>
                            </div>
                        </div>

                        <div className="feature-info-card">
                            <div className="info-icon-box purple">
                                <i className="fa-regular fa-bell"></i>
                            </div>
                            <div className="info-text-box">
                                <h4>Service Alerts</h4>
                                <p>Receive smart reminders based on your vehicle's specific ceramic coating lifespan.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ServiceHistory;
