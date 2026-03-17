import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import VehicleService from '../../../services/vehicle.service';
import getImageUrl from '../../../util/getImageUrl';
import './MyGarage.css';

const MyGarage = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const fetchVehicles = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await VehicleService.getMyVehicles();
            setVehicles(res?.payload?.vehicles || []);
        } catch (error) {
            console.error("Failed to fetch vehicles:", error);
            setErrorMsg("Failed to load your vehicles. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (vehicleId) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await VehicleService.deleteVehicle(vehicleId);
                setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
                alert("Vehicle deleted successfully.");
            } catch (error) {
                console.error("Error deleting vehicle:", error);
                alert(error?.message || "Failed to delete vehicle.");
            }
        }
    };

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="My Digital Garage" />

                <main className="garage-main-content">
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
                                <h3 className="stat-num">{vehicles.length}</h3>
                                <span className="stat-label">TOTAL VEHICLES</span>
                            </div>
                        </div>

                        <div className="mini-stat-card">
                            <div className="mini-icon-box blue">
                                <i className="fa-solid fa-clock-rotate-left"></i>
                            </div>
                            <div className="mini-stat-info">
                                <h3 className="stat-num">0</h3>
                                <span className="stat-label">SERVICE LOGS</span>
                            </div>
                        </div>
                    </div>

                    {errorMsg && <div style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</div>}

                    {/* Vehicle Grid */}
                    {loading ? (
                        <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
                            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                            <p>Loading your garage...</p>
                        </div>
                    ) : (
                        <div className="vehicle-grid">
                            {vehicles.map((vehicle) => (
                                <div className="vehicle-card" key={vehicle._id}>
                                    <div className="card-image-wrapper">
                                        <img 
                                            src={vehicle.image && vehicle.image.fileName ? getImageUrl(vehicle.image.fileName) : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"} 
                                            alt={vehicle.model} 
                                            className="vehicle-card-img" 
                                        />
                                        {/* Dynamic status could be fetched from ongoing services later */}
                                        <span className="status-badge active">
                                            REGISTERED
                                        </span>
                                    </div>
                                    <div className="card-content">
                                        <div className="vehicle-basic-info">
                                            <h4 className="vehicle-title" style={{textTransform: "capitalize"}}>
                                                {vehicle.make} {vehicle.model}
                                            </h4>
                                            <span className="vehicle-year">{vehicle.type}</span>
                                        </div>
                                        <div className="vehicle-meta">
                                            <div className="meta-item plate">
                                                <span>{vehicle.licensePlate}</span>
                                            </div>
                                            <div className="meta-item time">
                                                <i className="fa-regular fa-calendar-check"></i>
                                                <span>Added {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <Link to={`/customer/my-garage/${vehicle._id}`} className="view-details-link">
                                            <span>VIEW DETAILS</span>
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </Link>
                                        <div className="action-icons">
                                            <button className="icon-btn edit" onClick={() => navigate(`/customer/my-garage/edit/${vehicle._id}`)}>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(vehicle._id)}>
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add Another Vehicle Placeholder */}
                            <Link to="/customer/my-garage/add" className="add-placeholder-card">
                                <div className="placeholder-content">
                                    <div className="plus-circle">
                                        <i className="fa-solid fa-plus"></i>
                                    </div>
                                    <h4 className="placeholder-title">Add Another Vehicle</h4>
                                    <p className="placeholder-text">Track and manage more cars in your profile</p>
                                </div>
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyGarage;
