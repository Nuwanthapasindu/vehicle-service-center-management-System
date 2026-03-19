import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './VehicleDetails.css';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form state for Modal
    const [formData, setFormData] = useState({
        licensePlate: '',
        type: '',
        make: '',
        model: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchVehicle = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/vehicle/${id}`);
            setVehicle(response.data.payload.vehicle);
        } catch (error) {
            toast.error("Failed to load vehicle details.");
            console.error(error);
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchVehicle();
        }
    }, [id, navigate]);

    const getImageUrl = (imageObj) => {
        if (imageObj && imageObj.fileName) {
            return `${import.meta.env.VITE_SERVER_URL}/storage/uploads/${imageObj.fileName}`;
        }
        return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80";
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to completely remove this vehicle?")) {
            try {
                await axios.delete(`/vehicle/${id}`);
                toast.success("Vehicle removed securely.");
                navigate(-1); // Safely go back to MyGarage
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.payload?.message || "Failed to remove vehicle.");
            }
        }
    };

    const openUpdateModal = () => {
        setFormData({
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            make: vehicle.make,
            model: vehicle.model
        });
        setImagePreview(getImageUrl(vehicle.image));
        setImageFile(null); // Clear any old file selection
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            let imageId = vehicle.image?._id; // Default to existing image ID if not changed

            // Step 1: Handle image upload independently just like AddVehicle
            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('file', imageFile);

                const uploadRes = await axios.post('/file', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                // Fetch the new returned image _id
                imageId = uploadRes.data?.payload?.file?._id || uploadRes.data?.payload?.file?.id;
            }

            // Step 2: Push JSON logic exactly to our Vehicle Controller
            const payload = {
                ...formData,
                image: imageId
            };

            const updateRes = await axios.put(`/vehicle/${id}`, payload);
            toast.success(updateRes?.data?.payload?.message || "Vehicle updated successfully");

            // Refetch current details silently to refresh the static DB screen models
            await fetchVehicle();
            setShowModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.payload?.message || "Failed to update vehicle.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading || !vehicle) {
        return (
            <div className="customer-portal-wrapper">
                <Sidebar />
                <div className="customer-content-area">
                    <Header title="Customer Dashboard" />
                    <main className="vehicle-details-main">
                        <div style={{ textAlign: "center", padding: "5rem" }}>
                            <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
                            <p style={{ marginTop: "1rem" }}>Loading vehicle details...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

                <main className="vehicle-details-main">
                    <nav className="breadcrumbs">
                        <i className="fa-solid fa-house"></i>
                        <Link to="/customer/my-garage">Garage</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">{vehicle.make} {vehicle.model}</span>
                    </nav>

                    <section className="vehicle-hero-card">
                        <div className="hero-image-overlay"></div>
                        <img
                            src={getImageUrl(vehicle.image)}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="hero-bg-img"
                        />

                        <div className="hero-content">
                            <div className="hero-meta-badges">
                                <span className="status-badge active">ACTIVE</span>
                                <span className="meta-info"><i className="fa-regular fa-calendar"></i> {new Date(vehicle.createdAt).getFullYear()}</span>
                                <span className="meta-info"><i className="fa-solid fa-id-card"></i> {vehicle.licensePlate}</span>
                            </div>

                            <div className="hero-footer-row">
                                <h2 className="vehicle-display-name">{vehicle.make} {vehicle.model}</h2>
                                <div className="hero-actions">
                                    <button className="update-details-btn" onClick={openUpdateModal}>
                                        <i className="fa-solid fa-pen-to-square"></i>
                                        Update Details
                                    </button>
                                    <button className="remove-vehicle-btn" onClick={handleDelete}>
                                        <i className="fa-solid fa-trash-can"></i>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="details-grid">
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
                                    <span className="spec-value">{vehicle.licensePlate}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Type</span>
                                    <span className="spec-value">{vehicle.type}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Make</span>
                                    <span className="spec-value">{vehicle.make}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Model</span>
                                    <span className="spec-value">{vehicle.model}</span>
                                </div>
                                <div className="spec-item border-none">
                                    <span className="spec-label">Date Added</span>
                                    <span className="spec-value">{new Date(vehicle.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

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
                                <div className="timeline-item">
                                    <div className="timeline-marker grey">
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                    </div>
                                    <div className="service-entry-card">
                                        <p style={{textAlign:"center", padding:"2rem", color:"var(--secondary)"}}>No service history logged yet.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="history-footer">
                                <button className="load-more-btn" disabled>Load More History</button>
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
                            <button className="close-modal-btn" onClick={() => setShowModal(false)} disabled={isUpdating}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body">
                                <div className="modal-form-group">
                                    <label>VEHICLE IMAGE</label>
                                    <div className="modal-image-dropzone" style={{ position: 'relative' }}>
                                        <input 
                                            type="file" 
                                            accept="image/png, image/jpeg, image/jpg" 
                                            onChange={handleImageChange}
                                            style={{
                                                position: 'absolute',
                                                top: 0, left: 0, width: '100%', height: '100%',
                                                opacity: 0, cursor: 'pointer', zIndex: 10
                                            }}
                                        />
                                        <img
                                            src={imagePreview}
                                            alt={vehicle.model}
                                            className="dropzone-bg-img"
                                        />
                                        <div className="dropzone-overlay">
                                            <i className="fa-solid fa-camera-retro"></i>
                                            <p>{imageFile ? imageFile.name : "Click to upload or drag and drop"}</p>
                                            <span className="hint">PNG, JPG up to 10MB</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-form-row">
                                    <div className="modal-form-group">
                                        <label>LICENSE PLATE</label>
                                        <input 
                                            type="text" 
                                            name="licensePlate"
                                            value={formData.licensePlate}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="modal-form-group">
                                        <label>VEHICLE TYPE</label>
                                        <div className="modal-select-wrapper">
                                            <select 
                                                name="type" 
                                                value={formData.type} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="CAR">Car</option>
                                                <option value="VAN">Van</option>
                                                <option value="SUV">SUV</option>
                                                <option value="JEEP">Jeep</option>
                                            </select>
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-form-row">
                                    <div className="modal-form-group">
                                        <label>MAKE</label>
                                        <input 
                                            type="text" 
                                            name="make"
                                            value={formData.make}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="modal-form-group">
                                        <label>MODEL</label>
                                        <input 
                                            type="text" 
                                            name="model"
                                            value={formData.model}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)} disabled={isUpdating}>Cancel</button>
                                <button type="submit" className="modal-save-btn" disabled={isUpdating}>
                                    {isUpdating ? "SAVING..." : "SAVE CHANGES"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;
