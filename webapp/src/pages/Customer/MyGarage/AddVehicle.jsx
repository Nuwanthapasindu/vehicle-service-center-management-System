import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './AddVehicle.css';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [licensePlate, setLicensePlate] = useState('');
    const [type, setType] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!licensePlate || !type || !make || !model) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            let imageId = null;

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await axios.post('/file', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageId = uploadRes.data?.payload?.file?._id || uploadRes.data?.payload?.file?.id;
            }

            const payload = {
                licensePlate,
                type,
                make,
                model,
                ...(imageId && { image: imageId })
            };

            const response = await axios.post('/vehicle/add', payload);
            toast.success(response.data.payload.message || "Vehicle added successfully!");
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.payload?.message || "Something went wrong. Please try again.");
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

                        <form className="add-vehicle-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="licensePlate">License Plate</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        id="licensePlate"
                                        placeholder="ENTER PLATE (Eg: ABC-1234)"
                                        value={licensePlate}
                                        onChange={(e) => setLicensePlate(e.target.value)}
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
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
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
                                            value={make}
                                            onChange={(e) => setMake(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Select make</option>
                                            <option value="Toyota">Toyota</option>
                                            <option value="Honda">Honda</option>
                                            <option value="Nissan">Nissan</option>
                                            <option value="BMW">BMW</option>
                                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                                            <option value="Audi">Audi</option>
                                            <option value="Ford">Ford</option>
                                            <option value="Kia">Kia</option>
                                            <option value="Hyundai">Hyundai</option>
                                            <option value="Suzuki">Suzuki</option>
                                            <option value="Porsche">Porsche</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <i className="fa-solid fa-chevron-down select-icon"></i>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="model">Model</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="text"
                                            id="model"
                                            placeholder="Enter Model (Eg: Corolla, X5)"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '1rem 1.25rem',
                                                border: '1px solid var(--border-color, #E2E8F0)',
                                                borderRadius: '12px',
                                                backgroundColor: 'var(--light, #FFFFFF)',
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                color: 'var(--dark, #1A1D23)'
                                            }}
                                        />
                                        <i className="fa-solid fa-car input-right-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Upload Image</label>
                                <div className="upload-dropzone" onClick={() => document.getElementById('vehicleImage').click()}>
                                    <input 
                                        type="file" 
                                        id="vehicleImage" 
                                        className="file-input" 
                                        hidden 
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
                                            <p className="upload-text" style={{ marginTop: '0.5rem' }}>Click to change image</p>
                                        </div>
                                    ) : (
                                        <div className="dropzone-label">
                                            <i className="fa-solid fa-camera-retro upload-icon"></i>
                                            <p className="upload-text">Click to upload or drag and drop</p>
                                            <p className="upload-hint">PNG, JPG or WEBP (MAX. 5MB)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions-row">
                                <button type="submit" className="add-btn" disabled={loading}>
                                    <i className={loading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-circle-plus"}></i>
                                    {loading ? 'Adding...' : 'Add to Garage'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => navigate(-1)} disabled={loading}>
                                    Cancel
                                </button>
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
