import React from 'react';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './AddVehicle.css';

const AddVehicle = () => {
    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

                <main className="add-vehicle-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <i className="fa-solid fa-house"></i>
                        <span>Garage</span>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Add New Vehicle</span>
                    </nav>

                    {/* Page Header */}
                    <section className="page-title-section">
                        <h2 className="page-title">
                            Keep your fleet <span className="highlight">shining</span>.
                        </h2>
                        <p className="page-subtitle">
                            Registering your vehicle allows us to provide personalized detailing packages and track your maintenance history more effectively.
                        </p>
                    </section>

                    {/* Form Card */}
                    <div className="add-vehicle-card">
                        <div className="card-header-text">
                            <h3 className="card-title">Add New Vehicle</h3>
                            <p className="card-subtitle">Provide your vehicle information to get started.</p>
                        </div>

                        <form className="add-vehicle-form">
                            <div className="form-group">
                                <label htmlFor="licensePlate">License Plate</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        id="licensePlate"
                                        placeholder="ENTER PLATE"
                                    />
                                    <i className="fa-solid fa-id-card input-right-icon"></i>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <div className="select-wrapper">
                                    <select id="vehicleType" defaultValue="">
                                        <option value="" disabled>Select type</option>
                                        <option value="sedan">Sedan</option>
                                        <option value="suv">SUV</option>
                                        <option value="coupe">Coupe</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down select-icon"></i>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="make">Make</label>
                                    <div className="select-wrapper">
                                        <select id="make" defaultValue="">
                                            <option value="" disabled>Select make</option>
                                            <option value="bmw">BMW</option>
                                            <option value="porsche">Porsche</option>
                                            <option value="toyota">Toyota</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down select-icon"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="model">Model</label>
                                    <div className="select-wrapper">
                                        <select id="model" defaultValue="">
                                            <option value="" disabled>Select model</option>
                                            <option value="x5">X5</option>
                                            <option value="911">911</option>
                                            <option value="camry">Camry</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down select-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Upload Image</label>
                                <div className="upload-dropzone">
                                    <input type="file" id="vehicleImage" className="file-input" hidden />
                                    <label htmlFor="vehicleImage" className="dropzone-label">
                                        <i className="fa-solid fa-camera-retro upload-icon"></i>
                                        <p className="upload-text">Click to upload or drag and drop</p>
                                        <p className="upload-hint">PNG, JPG or WEBP (MAX. 5MB)</p>
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions-row">
                                <button type="submit" className="add-btn">
                                    <i className="fa-solid fa-circle-plus"></i>
                                    Add to Garage
                                </button>
                                <button type="button" className="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>

                    {/* Info Note Section */}
                    <div className="info-note-section">
                        <i className="fa-solid fa-circle-info info-icon"></i>
                        <p className="info-text">
                            <strong>Note:</strong> Your license plate is used to quickly identify your vehicle when you arrive at our service center.
                        </p>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AddVehicle;
