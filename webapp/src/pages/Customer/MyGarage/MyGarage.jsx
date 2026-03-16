import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './MyGarage.css';

const MyGarage = () => {
    const navigate = useNavigate();
    const vehicles = [
        {
            id: 1,
            name: "BMW X5 m50i",
            year: "2020",
            plate: "DET-4556",
            lastService: "5d ago",
            status: "",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            name: "Porsche 911 Carrera",
            year: "2023",
            plate: "ABC-1234",
            lastService: "Detained 2w ago",
            status: "ACTIVE",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            name: "Toyota Camry SE",
            year: "2021",
            plate: "XYZ-9876",
            lastService: "In shop now",
            status: "IN SERVICE",
            image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80"
        }
    ];

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
                                <h3 className="stat-num">4</h3>
                                <span className="stat-label">TOTAL VEHICLES</span>
                            </div>
                        </div>

                        <div className="mini-stat-card">
                            <div className="mini-icon-box blue">
                                <i className="fa-solid fa-clock-rotate-left"></i>
                            </div>
                            <div className="mini-stat-info">
                                <h3 className="stat-num">24</h3>
                                <span className="stat-label">SERVICE LOGS</span>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Grid */}
                    <div className="vehicle-grid">
                        {vehicles.map((vehicle) => (
                            <div className="vehicle-card" key={vehicle.id}>
                                <div className="card-image-wrapper">
                                    <img src={vehicle.image} alt={vehicle.name} className="vehicle-card-img" />
                                    {vehicle.status && (
                                        <span className={`status-badge ${vehicle.status.toLowerCase().replace(' ', '-')}`}>
                                            {vehicle.status}
                                        </span>
                                    )}
                                </div>
                                <div className="card-content">
                                    <div className="vehicle-basic-info">
                                        <h4 className="vehicle-title">{vehicle.name}</h4>
                                        <span className="vehicle-year">{vehicle.year}</span>
                                    </div>
                                    <div className="vehicle-meta">
                                        <div className="meta-item plate">
                                            <span>{vehicle.plate}</span>
                                        </div>
                                        <div className="meta-item time">
                                            <i className="fa-regular fa-calendar-check"></i>
                                            <span>{vehicle.lastService}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <Link to={`/customer/my-garage/${vehicle.id}`} className="view-details-link">
                                        <span>VIEW DETAILS</span>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                    <div className="action-icons">
                                        <button className="icon-btn edit"><i className="fa-regular fa-pen-to-square"></i></button>
                                        <button className="icon-btn delete"><i className="fa-regular fa-trash-can"></i></button>
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

                </main>
            </div>
        </div>
    );
};

export default MyGarage;
