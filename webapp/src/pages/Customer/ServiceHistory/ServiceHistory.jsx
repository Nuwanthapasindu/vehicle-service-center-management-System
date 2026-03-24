import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './ServiceHistory.css';

const ServiceHistory = () => {
    const [historyData, setHistoryData] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [historyRes, vehiclesRes] = await Promise.all([
                    axios.get('/booking/my-history'),
                    axios.get('/vehicle/my-vehicles')
                ]);
                setHistoryData(historyRes.data.payload.history || []);
                setVehicles(vehiclesRes.data.payload.vehicles || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = historyData.filter(item => {
        const matchesSearch = item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        
        const matchesVehicle = vehicleFilter === 'all' || item.vehicle.toLowerCase().includes(vehicleFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesVehicle;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'FINISH': return 'completed';
            case 'START': return 'progress';
            case 'PENDING': return 'pending';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'FINISH': return 'COMPLETED';
            case 'START': return 'IN PROGRESS';
            case 'PENDING': return 'PENDING';
            default: return status;
        }
    };

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

                <main className="history-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <Link to="/customer/dashboard">Home</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Service History</span>
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
                            <input
                                type="text"
                                placeholder="Search by vehicle, plate or service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="select-filters">
                            <div className="filter-select">
                                <select 
                                    value={vehicleFilter}
                                    onChange={(e) => setVehicleFilter(e.target.value)}
                                >
                                    <option value="all">All Vehicles</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={`${v.make} ${v.model}`}>
                                            {v.make} {v.model}
                                        </option>
                                    ))}
                                </select>
                                <i className="fa-solid fa-chevron-down"></i>
                            </div>
                            <div className="filter-select">
                                <select defaultValue="6m">
                                    <option value="all">All Time</option>
                                    <option value="6m">Date Range: Last 6 Months</option>
                                    <option value="1y">Last Year</option>
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
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>
                                    <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                                    <p style={{ marginTop: '1rem' }}>Loading history...</p>
                                </div>
                            ) : filteredData.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>
                                    <p>No records found.</p>
                                </div>
                            ) : (
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>DATE</th>
                                            <th>VEHICLE</th>
                                            <th>SERVICE</th>
                                            <th>STATUS</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="date-cell">
                                                    {new Date(item.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="vehicle-cell">
                                                    <div>{item.vehicle}</div>
                                                    <small style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{item.licensePlate}</small>
                                                </td>
                                                <td className="service-cell">{item.service}</td>
                                                <td>
                                                    <span className={`status-pill ${getStatusClass(item.status)}`}>
                                                        {getStatusText(item.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="review-link-btn">
                                                        Review <i className="fa-solid fa-star"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
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
