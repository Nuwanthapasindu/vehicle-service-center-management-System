import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './VehicleDetails.css';

const VehicleDetails = () => {
    // In a real app, we'd fetch data based on this ID
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

                <main className="vehicle-details-main">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <i className="fa-solid fa-house"></i>
                        <Link to="/customer/dashboard">Garage</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Porsche 911 Carrera</span>
                    </nav>

                    {/* Vehicle Hero Section */}
                    <section className="vehicle-hero-card">
                        <div className="hero-image-overlay"></div>
                        <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                            alt="Porsche 911 Carrera"
                            className="hero-bg-img"
                        />

                        <div className="hero-content">
                            <div className="hero-meta-badges">
                                <span className="status-badge active">ACTIVE</span>
                                <span className="meta-info"><i className="fa-regular fa-calendar"></i> 2023</span>
                                <span className="meta-info"><i className="fa-solid fa-id-card"></i> ABC-1234</span>
                            </div>

                            <div className="hero-footer-row">
                                <h2 className="vehicle-display-name">Porsche 911 Carrera</h2>
                                <div className="hero-actions">
                                    <button className="update-details-btn" onClick={() => setShowModal(true)}>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                        Update Details
                                    </button>
                                    <button className="remove-vehicle-btn">
                                        <i className="fa-solid fa-trash-can"></i>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content Grid */}
                    <div className="details-grid">
                        {/* Specifications Card */}
                        <div className="details-card specs-card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fa-solid fa-chart-column"></i>
                                    Vehicle Specifications
                                </h3>
                            </div>
                            <div className="specs-list">
                                <div className="spec-item">
                                    <span className="spec-label">Number Plate</span>
                                    <span className="spec-value">CAV-1212</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Type</span>
                                    <span className="spec-value">Sport Coupe</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Make</span>
                                    <span className="spec-value">Porsche</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Model</span>
                                    <span className="spec-value">911 Carrera</span>
                                </div>
                                <div className="spec-item border-none">
                                    <span className="spec-label">Date Added</span>
                                    <span className="spec-value">Oct 12, 2023</span>
                                </div>
                            </div>
                        </div>

                        {/* Service History Card */}
                        <div className="details-card history-card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                    Service History
                                </h3>
                                <button className="download-pdf-btn">
                                    Download PDF Log <i className="fa-solid fa-download"></i>
                                </button>
                            </div>

                            <div className="timeline-container">
                                {/* Service Entry 1 */}
                                <div className="timeline-item completed">
                                    <div className="timeline-marker">
                                        <i className="fa-solid fa-circle-check"></i>
                                    </div>
                                    <div className="service-entry-card">
                                        <div className="entry-header">
                                            <div className="entry-title-box">
                                                <h4 className="entry-name">Ceramic Coating & Paint Correction</h4>
                                                <p className="entry-desc">Stage 2 Detail + 5-Year Ceramic Protection</p>
                                            </div>
                                            <div className="entry-price">LKR1,499.00</div>
                                        </div>
                                        <div className="entry-meta">
                                            <span><i className="fa-regular fa-calendar"></i> Jan 15, 2024</span>
                                            <span><i className="fa-solid fa-gauge-high"></i> 4,200 mi</span>
                                            <span className="status-pill completed">COMPLETED</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Entry 2 */}
                                <div className="timeline-item completed">
                                    <div className="timeline-marker">
                                        <i className="fa-solid fa-circle-check"></i>
                                    </div>
                                    <div className="service-entry-card">
                                        <div className="entry-header">
                                            <div className="entry-title-box">
                                                <h4 className="entry-name">Interior Executive Detail</h4>
                                                <p className="entry-desc">Deep leather conditioning and ozone treatment</p>
                                            </div>
                                            <div className="entry-price">LKR 12,000</div>
                                        </div>
                                        <div className="entry-meta">
                                            <span><i className="fa-regular fa-calendar"></i> Nov 02, 2023</span>
                                            <span><i className="fa-solid fa-gauge-high"></i> 1,850 mi</span>
                                            <span className="status-pill completed">COMPLETED</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Entry 3 */}
                                <div className="timeline-item">
                                    <div className="timeline-marker grey">
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                    </div>
                                    <div className="service-entry-card">
                                        <div className="entry-header">
                                            <div className="entry-title-box">
                                                <h4 className="entry-name">Full Exterior Wash</h4>
                                                <p className="entry-desc">Basic maintenance hand wash and vacuum</p>
                                            </div>
                                            <div className="entry-price">LKR 13,000</div>
                                        </div>
                                        <div className="entry-meta">
                                            <span><i className="fa-regular fa-calendar"></i> Oct 18, 2023</span>
                                            <span><i className="fa-solid fa-gauge-high"></i> 240 mi</span>
                                            <span className="status-pill completed">COMPLETED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="history-footer">
                                <button className="load-more-btn">Load More History</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Update Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="update-vehicle-modal">
                        <div className="modal-header">
                            <h3>Update Vehicle Details</h3>
                            <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-form-group">
                                <label>VEHICLE IMAGE</label>
                                <div className="modal-image-dropzone">
                                    <img
                                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
                                        alt="Current Vehicle"
                                        className="dropzone-bg-img"
                                    />
                                    <div className="dropzone-overlay">
                                        <i className="fa-solid fa-camera-retro"></i>
                                        <p>Click to upload or drag and drop</p>
                                        <span className="hint">PNG, JPG up to 10MB</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-form-row">
                                <div className="modal-form-group">
                                    <label>LICENSE PLATE</label>
                                    <input type="text" defaultValue="ABC-1234" />
                                </div>
                                <div className="modal-form-group">
                                    <label>VEHICLE TYPE</label>
                                    <div className="modal-select-wrapper">
                                        <select defaultValue="sport">
                                            <option value="sport">Sport Coupe</option>
                                            <option value="sedan">Sedan</option>
                                            <option value="suv">SUV</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-form-row">
                                <div className="modal-form-group">
                                    <label>MAKE</label>
                                    <input type="text" defaultValue="Porsche" />
                                </div>
                                <div className="modal-form-group">
                                    <label>MODEL</label>
                                    <input type="text" defaultValue="911 Carrera" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="modal-save-btn">SAVE CHANGES</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;

