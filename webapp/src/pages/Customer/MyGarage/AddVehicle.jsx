import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import VehicleService from '../../../services/vehicle.service';
import FileService from '../../../services/file.service';
import './AddVehicle.css';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        licensePlate: '',
        vehicleType: '',
        make: '',
        model: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            let imageId = null;

            // 1. Upload the image if selected
            if (imageFile) {
                const uploadRes = await FileService.uploadFile(imageFile);
                imageId = uploadRes?.payload?.file?.id;
            }

            // 2. Map form data to backend payload
            const vehiclePayload = {
                licensePlate: formData.licensePlate,
                type: formData.vehicleType.toUpperCase(), // Assuming backend expects UPPERCASE (e.g. CAR, SUV)
                make: formData.make,
                model: formData.model,
                image: imageId || null,
            };

            // 3. Save the vehicle
            await VehicleService.createVehicle(vehiclePayload);

            alert("Vehicle added successfully!");
            navigate('/customer/my-garage');
        } catch (error) {
            console.error("Error adding vehicle:", error);
            setErrorMsg(error?.message || "Failed to add vehicle. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

                <main className="add-vehicle-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <i className="fa-solid fa-house"></i>
                        <span onClick={() => navigate('/customer/my-garage')} style={{ cursor: 'pointer' }}>Garage</span>
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

                        {errorMsg && <div style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</div>}

                        <form className="add-vehicle-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="licensePlate">License Plate</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        id="licensePlate"
                                        placeholder="ENTER PLATE"
                                        value={formData.licensePlate}
                                        onChange={handleChange}
                                        required
                                    />
                                    <i className="fa-solid fa-id-card input-right-icon"></i>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <div className="select-wrapper">
                                    <select
                                        id="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select type</option>
                                        <option value="CAR">Car</option>
                                        <option value="VAN">Van</option>
                                        <option value="SUV">SUV</option>
                                        <option value="JEEP">Jeep</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down select-icon"></i>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="make">Make</label>
                                    <div className="select-wrapper">
                                        <select
                                            id="make"
                                            value={formData.make}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select make</option>
                                            <option value="bmw">BMW</option>
                                            <option value="porsche">Porsche</option>
                                            <option value="toyota">Toyota</option>
                                            <option value="honda">Honda</option>
                                            <option value="nissan">Nissan</option>
                                            <option value="audi">Audi</option>
                                            <option value="mercedes">Mercedes</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down select-icon"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="model">Model</label>
                                    <div className="select-wrapper">
                                        {/* Ideally, models will be filtered by make, but we'll leave it simple for now or change to input if better */}
                                        <input
                                            type="text"
                                            id="model"
                                            placeholder="Enter Model (e.g. X5, 911)"
                                            value={formData.model}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Upload Image</label>
                                <div className="upload-dropzone">
                                    <input
                                        type="file"
                                        id="vehicleImage"
                                        className="file-input"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleFileChange}
                                        hidden
                                    />
                                    <label htmlFor="vehicleImage" className="dropzone-label">
                                        <i className="fa-solid fa-camera-retro upload-icon"></i>
                                        <p className="upload-text">
                                            {imageFile ? imageFile.name : "Click to upload or drag and drop"}
                                        </p>
                                        <p className="upload-hint">PNG, JPG or WEBP (MAX. 5MB)</p>
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions-row">
                                <button type="submit" className="add-btn" disabled={loading}>
                                    <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-circle-plus'}`}></i>
                                    {loading ? 'Adding...' : 'Add to Garage'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
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
