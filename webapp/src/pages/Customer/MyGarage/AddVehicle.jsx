import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import DragDropUpload from '../../../components/Upload/DragDropUpload';
import './AddVehicle.css';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const validationSchema = Yup.object({
        licensePlate: Yup.string().required("License plate is required"),
        type: Yup.string().required("Vehicle type is required"),
        make: Yup.string().required("Make is required"),
        model: Yup.string().required("Model is required"),
    });

    const formik = useFormik({
        initialValues: {
            licensePlate: '',
            type: '',
            make: '',
            model: ''
        },
        validationSchema,
        onSubmit: async (values) => {
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
                    ...values,
                    image: imageId
                };

                const response = await axios.post('/vehicle/add', payload);
                toast.success(response.data.payload.message || "Vehicle added successfully!");
                navigate(-1);
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.payload?.message || "Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    });

    const handleFileChange = (file) => {
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
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

                        <form className="add-vehicle-form" onSubmit={formik.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="licensePlate">License Plate</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        id="licensePlate"
                                        name="licensePlate"
                                        placeholder="ENTER PLATE (Eg: ABC-1234)"
                                        value={formik.values.licensePlate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={formik.touched.licensePlate && formik.errors.licensePlate ? 'error' : ''}
                                    />
                                    <i className="fa-solid fa-id-card input-right-icon"></i>
                                </div>
                                {formik.touched.licensePlate && formik.errors.licensePlate && (
                                    <span className="error-text" style={{color: 'red', fontSize: '11px', fontWeight: 'bold'}}>{formik.errors.licensePlate}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <div className="select-wrapper">
                                    <select 
                                        id="type"
                                        name="type"
                                        value={formik.values.type}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={formik.touched.type && formik.errors.type ? 'error' : ''}
                                    >
                                        <option value="" disabled>Select type</option>
                                        <option value="CAR">Car</option>
                                        <option value="VAN">Van</option>
                                        <option value="SUV">SUV</option>
                                        <option value="JEEP">Jeep</option>
                                    </select>
                                    <i className="fa-solid fa-chevron-down select-icon"></i>
                                </div>
                                {formik.touched.type && formik.errors.type && (
                                    <span className="error-text" style={{color: 'red', fontSize: '11px', fontWeight: 'bold'}}>{formik.errors.type}</span>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="make">Make</label>
                                    <div className="select-wrapper">
                                        <select 
                                            id="make"
                                            name="make"
                                            value={formik.values.make}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.make && formik.errors.make ? 'error' : ''}
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
                                    {formik.touched.make && formik.errors.make && (
                                        <span className="error-text" style={{color: 'red', fontSize: '11px', fontWeight: 'bold'}}>{formik.errors.make}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="model">Model</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            placeholder="Enter Model (Eg: Corolla, X5)"
                                            value={formik.values.model}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.model && formik.errors.model ? 'error' : ''}
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
                                    {formik.touched.model && formik.errors.model && (
                                        <span className="error-text" style={{color: 'red', fontSize: '11px', fontWeight: 'bold'}}>{formik.errors.model}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Upload Image</label>
                                <DragDropUpload 
                                    onFileChange={handleFileChange} 
                                    previewUrl={imagePreview} 
                                />
                            </div>

                            <div className="form-actions-row">
                                <button type="submit" className="add-btn" disabled={loading || !formik.isValid}>
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
