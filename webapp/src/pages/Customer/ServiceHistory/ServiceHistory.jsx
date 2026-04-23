import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import axios from 'axios';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import { enums } from '../../../constants/enum';
import { formatShortDate } from '../../../util/dateFormatter';
import { getStatusClass, getStatusText } from '../../../util/statusFormatter';
import { toast } from 'react-toastify';
import { exportHistoryToPDF } from '../../../util/historyExporter';
import './ServiceHistory.css';

const ServiceHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [historyData, setHistoryData] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [vehicleFilter, setVehicleFilter] = useState(location.state?.vehicleId || 'all');
    const [durationFilter, setDurationFilter] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sync filter with router state (deep-linking from other pages)
    useEffect(() => {
        const vehicleId = location.state?.vehicleId || 'all';
        setVehicleFilter(vehicleId);
        setCurrentPage(1);
    }, [location.state?.vehicleId]);

    const handleExport = () => {
        if (historyData.length === 0) {
            toast.info("No records to export.");
            return;
        }

        const selectedVehicle = vehicleFilter !== 'all'
            ? vehicles.find(v => v._id === vehicleFilter)
            : null;

        const activeFilters = {
            search: searchTerm,
            status: statusFilter,
            duration: durationFilter
        };

        exportHistoryToPDF(historyData, selectedVehicle, activeFilters);
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/booking/my-history', {
                    params: {
                        search: searchTerm,
                        status: statusFilter,
                        vehicle: vehicleFilter,
                        duration: durationFilter
                    }
                });
                setHistoryData(response.data.payload.history || []);
                setCurrentPage(1); // Reset to first page on new search/filter
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || "Failed to fetch service history");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchHistory();
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, vehicleFilter, durationFilter]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = historyData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(historyData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get visible page range (max 5)
    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehiclesRes = await axios.get('/vehicle/my-vehicles');
                setVehicles(vehiclesRes.data.payload.vehicles || []);
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || "Failed to fetch vehicles.");
            }
        };
        fetchVehicles();
    }, []);

    const handleReviewClick = (bookingId) => {
        navigate(`/customer/reviews/write/${bookingId}`);
    };


    return (
        <CustomerLayout title="Service History">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/customer/dashboard">
                    <i className="fa-solid fa-house"></i>
                    Dashboard
                </Link>
                <i className="fa-solid fa-chevron-right"></i>
                <span className="active">Service History</span>
            </nav>

            {/* Page Title Section */}
            <section className="page-title-section">
                <div className="title-text-box">
                    <h1 className="page-title">Service History</h1>
                    <p className="page-subtitle">
                        Manage and review all your professional detailing records in one place.
                    </p>
                </div>
                <Link to="/customer/service-booking" className="book-new-btn">
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>BOOK NEW SERVICE</span>
                </Link>
            </section>

            {/* Cancellation Notice Alert */}
            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fa-solid fa-phone" style={{ color: '#D97706', fontSize: '20px' }}></i>
                <p style={{ margin: 0, color: '#92400E', fontSize: '14px', lineHeight: '1.5' }}>
                    <strong>Need to cancel or change a booking?</strong> Online modifications are not supported. Please call our service center directly at <strong>+94 77 123 4567</strong> for assistance.
                </p>
            </div>

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
                                <option key={v._id} value={v._id}>
                                    {v.make} {v.model}
                                </option>
                            ))}
                        </select>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                    <div className="filter-select">
                        <select
                            value={durationFilter}
                            onChange={(e) => setDurationFilter(e.target.value)}
                        >
                            <option value="all">All Time</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last Year</option>
                            <option value="2y">Last 2 Years</option>
                            <option value="5y">Last 5 Years</option>
                        </select>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>

                    <div className="filter-select">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value={enums.JOBCARD_STATUS.PENDING}>Pending</option>
                            <option value={enums.JOBCARD_STATUS.START}>In-Progress</option>
                            <option value={enums.JOBCARD_STATUS.FINISH}>Completed</option>
                        </select>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </div>
            </div>

            {/* History Table Card */}
            <div className="history-table-card">
                <div className="card-header">
                    <h3 className="card-title">Service History Preview</h3>
                    <div className="items-count-badge">
                        {historyData.length === 0
                            ? "Showing 0 of 0 records"
                            : `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, historyData.length)} of ${historyData.length} records`
                        }
                    </div>
                </div>
                <div className="table-responsive">
                    {loading ? (
                        <div className="loading-state-container">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <p>Loading history...</p>
                        </div>
                    ) : currentItems.length === 0 ? (
                        <div className="empty-state-container">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-clock-rotate-left"></i>
                            </div>
                            <p className="empty-state-text">No service history yet.</p>
                            <Link to="/customer/service-booking" className="empty-state-btn">Book Your First Service</Link>
                        </div>
                    ) : (
                        <>
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>VEHICLE</th>
                                        <th>SERVICE</th>
                                        <th>MILEAGE</th>
                                        <th>STATUS</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="date-cell">
                                                {formatShortDate(item.date)}
                                            </td>
                                            <td className="vehicle-cell">
                                                <div>{item.vehicle}</div>
                                                <small style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{item.licensePlate}</small>
                                            </td>
                                            <td className="service-cell">{item.service}</td>
                                            <td className="mileage-cell">
                                                {item.milageCount ? `${item.milageCount.toLocaleString()} km` : 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`status-pill ${getStatusClass(item.status)}`}>
                                                    {getStatusText(item.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`review-link-btn ${(item.status !== enums.JOBCARD_STATUS.FINISH || item.hasReview) ? 'disabled' : ''}`}
                                                    disabled={item.status !== enums.JOBCARD_STATUS.FINISH || item.hasReview}
                                                    onClick={() => handleReviewClick(item.id)}
                                                >
                                                    {item.hasReview ? 'Reviewed' : 'Review'} <i className="fa-solid fa-star"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-wrapper">
                                    <button
                                        className="pagination-btn arrow"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>

                                    <div className="page-numbers">
                                        {getPageNumbers().map((pageNumber) => (
                                            <button
                                                key={pageNumber}
                                                className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                                                onClick={() => paginate(pageNumber)}
                                            >
                                                {pageNumber}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="pagination-btn arrow"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                            )}
                        </>
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

                <div
                    className={`feature-info-card ${historyData.length === 0 ? 'disabled' : ''}`}
                    onClick={handleExport}
                    style={{ cursor: historyData.length > 0 ? 'pointer' : 'not-allowed' }}
                >
                    <div className="info-icon-box blue">
                        <i className="fa-regular fa-file-pdf"></i>
                    </div>
                    <div className="info-text-box">
                        <h4>Export History</h4>
                        {historyData.length > 0 ? (
                            <p>Download a full PDF report of your vehicle's care history for insurance or sales.</p>
                        ) : (
                            <p>No records available to export at this time.</p>
                        )}
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
        </CustomerLayout>
    );
};

export default ServiceHistory;
