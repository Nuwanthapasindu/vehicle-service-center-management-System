import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import './MyGarage.css';

const MyGarage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyVehicles();
    }, []);

    const fetchMyVehicles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/vehicle/my-vehicles');
            setVehicles(response.data.payload.vehicles || []);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVehicle = async (id) => {
        if (window.confirm("Are you sure you want to completely remove this vehicle from your garage?")) {
            try {
                const response = await axios.delete(`/vehicle/${id}`);
                setVehicles(prev => prev.filter(v => v._id !== id));
                toast.success(response.data.payload.message || "Vehicle removed securely.");
            } catch (error) {
                console.error("Deletion failed:", error);
                toast.error(error.response?.data?.payload?.message || "Failed to remove vehicle.");
            }
        }
    };

    const getImageUrl = (fileName) => {
        if (fileName) {
            return `${import.meta.env.VITE_SERVER_URL}/storage/uploads/${fileName}`;
        }
        // return a fallback dummy image
        return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80";
    };

    // Calculate overall stats
    const totalVehicles = vehicles.length;
    // We can just mock service logs for now or keep it like the original component
    const totalServiceLogs = 0;

    return (
        <CustomerLayout title="My Digital Garage">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <span>Dashboard</span>
                <i className="fa-solid fa-chevron-right"></i>
                <span className="active">My Digital Garage</span>
            </nav>

            {/* Page Header */}
            <section className="page-title-section">
                <div className="title-text">
                    <h2 className="page-title">My Digital Garage</h2>
                    <p className="page-subtitle">
                        Manage your personal vehicle fleet, track maintenance history, and keep your cars in showroom condition.
                    </p>
                </div>
                <Link to="/customer/my-garage/add" className="add-vehicle-btn">
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>Add New Vehicle</span>
                </Link>
            </section>

            {/* Stats Summary Row */}
            <div className="garage-stats-row">
                <div className="mini-stat-card">
                    <div className="mini-icon-box green">
                        <i className="fa-solid fa-car"></i>
                    </div>
                    <div className="mini-stat-info">
                        <h3 className="stat-num">{totalVehicles}</h3>
                        <span className="stat-label">TOTAL VEHICLES</span>
                    </div>
                </div>

                <div className="mini-stat-card">
                    <div className="mini-icon-box blue">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div className="mini-stat-info">
                        <h3 className="stat-num">{totalServiceLogs}</h3>
                        <span className="stat-label">SERVICE LOGS</span>
                    </div>
                </div>
            </div>

            {/* Vehicle Grid */}
            <div className="vehicle-grid">
                {loading ? (
                    <div className="loading-container" style={{ textAlign: "center", padding: "3rem", width: "100%", gridColumn: "1 / -1" }}>
                        <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p style={{ marginTop: "1rem" }}>Loading your garage...</p>
                    </div>
                ) : (
                    <>
                        {vehicles.map((vehicle) => (
                            <div className="vehicle-card" key={vehicle._id}>
                                <div className="card-image-wrapper">
                                    <img src={getImageUrl(vehicle.image?.fileName)} alt={vehicle.model} className="vehicle-card-img" />
                                    {/* For now, just assuming ACTIVE status */}
                                    <span className="status-badge active">
                                        ACTIVE
                                    </span>
                                </div>
                                <div className="card-content">
                                    <div className="vehicle-basic-info">
                                        <h4 className="vehicle-title">{vehicle.make} {vehicle.model}</h4>
                                        <span className="vehicle-year">{vehicle.type}</span>
                                    </div>
                                    <div className="vehicle-meta">
                                        <div className="meta-item plate">
                                            <span>{vehicle.licensePlate}</span>
                                        </div>
                                        <div className="meta-item time">
                                            <i className="fa-regular fa-calendar-check"></i>
                                            <span>{new Date(vehicle.createdAt).toLocaleDateString()} added</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to={`/customer/my-garage/${vehicle._id}`} className="view-details-link">
                                        <span>VIEW DETAILS</span>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                    <div className="action-icons">
                                        {/* <button className="icon-btn edit"><i className="fa-regular fa-pen-to-square"></i></button> */}
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => handleDeleteVehicle(vehicle._id)}
                                            title="Remove Vehicle"
                                        >
                                            <i className="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Add Another Vehicle Placeholder */}
                {!loading && (
                    <Link to="/customer/my-garage/add" className="add-placeholder-card">
                        <div className="placeholder-content">
                            <div className="plus-circle">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <h4 className="placeholder-title">Add Another Vehicle</h4>
                            <p className="placeholder-text">Track and manage more cars in your profile</p>
                        </div>
                    </Link>
                )}
            </div>
        </CustomerLayout>
    );
};

export default MyGarage;
