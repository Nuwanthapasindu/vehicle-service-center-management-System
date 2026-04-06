import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomerLayout from '../../../components/Customer/Layout/CustomerLayout';
import VehicleCard from '../../../components/Customer/VehicleCard/VehicleCard';
import './MyGarage.css';

const MyGarage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceLogsCount, setServiceLogsCount] = useState(0);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                // Fetch both vehicles and dashboard stats concurrently
                const [vehiclesRes, dashboardRes] = await Promise.all([
                    axios.get('/vehicle/my-vehicles'),
                    axios.get('/booking/dashboard')
                ]);

                setVehicles(vehiclesRes.data.payload.vehicles || []);
                setServiceLogsCount(dashboardRes.data.payload.data.stats.totalBookings || 0);
            } catch (error) {
                toast.error("Failed to load your garage metrics.");
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const fetchMyVehicles = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/vehicle/my-vehicles');
            setVehicles(response.data.payload.vehicles || []);
        } catch (error) {
            toast.error(error.response?.data?.payload?.message || "Failed to fetch vehicles.");
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

    // Calculate overall stats
    const totalVehicles = vehicles.length;
    const totalServiceLogs = serviceLogsCount;

    return (
        <CustomerLayout title="My Digital Garage">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/customer/dashboard">
                    <i className="fa-solid fa-house"></i>
                    <span>Dashboard</span>
                </Link>
                <i className="fa-solid fa-chevron-right"></i>
                <span className="active">My Digital Garage</span>
            </nav>

            {/* Page Header */}
            <section className="page-title-section">
                <div className="title-text">
                    <h1 className="page-title">My Digital Garage</h1>
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
                    <div className="loading-state-container">
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <p>Loading your garage...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="empty-state-container">
                        <div className="empty-state-icon">
                            <i className="fa-solid fa-car-side"></i>
                        </div>
                        <p className="empty-state-text">No records found.</p>
                        <Link to="/customer/my-garage/add" className="empty-state-btn">Add Your First Vehicle</Link>
                    </div>
                ) : (
                    <>
                        {vehicles.map((vehicle) => (
                            <VehicleCard
                                key={vehicle._id}
                                vehicle={vehicle}
                                onDelete={handleDeleteVehicle}
                            />
                        ))}
                    </>
                )}


                {/* Add Another Vehicle Placeholder */}
                {!loading && vehicles.length > 0 && (
                    <VehicleCard isNewCard />
                )}
            </div>
        </CustomerLayout>
    );
};

export default MyGarage;
