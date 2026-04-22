import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { vehicleValidationSchema } from '../../../schemas/vehicle';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import DragDropUpload from '../../../components/Upload/DragDropUpload';
import './AddVehicle.css';

const AddVehicle = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const formik = useFormik({
        initialValues: {
            licensePlate: '',
            type: '',
            make: '',
            model: '',
            year: ''
        },
        validationSchema: vehicleValidationSchema,
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
                        <Link to="/customer/dashboard">
                            <i className="fa-solid fa-house"></i>
                            Dashboard
                        </Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <Link to="/customer/my-garage">Garage</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Add New Vehicle</span>
                    </nav>

                    {/* Page Header */}
                    <section className="page-title-section">
                        <h1 className="page-title">
                            Keep your fleet <span className="highlight">shining</span>.
                        </h1>
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
                                    <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.licensePlate}</span>
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
                                    <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.type}</span>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="make">Make</label>
                                    <div className="input-with-icon">
                                        <input
                                            type="text"
                                            id="make"
                                            name="make"
                                            list="make-options"
                                            placeholder="Select or type make (Eg: Toyota)"
                                            value={formik.values.make}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.make && formik.errors.make ? 'error' : ''}
                                        />
                                        <i className="fa-solid fa-industry input-right-icon"></i>
                                        <datalist id="make-options">
                                            <option value="Toyota" />
                                            <option value="Honda" />
                                            <option value="Nissan" />
                                            <option value="BMW" />
                                            <option value="Mercedes-Benz" />
                                            <option value="Audi" />
                                            <option value="Ford" />
                                            <option value="Kia" />
                                            <option value="Hyundai" />
                                            <option value="Suzuki" />
                                            <option value="Porsche" />
                                            <option value="Lexus" />
                                            <option value="Mazda" />
                                            <option value="Volkswagen" />
                                        </datalist>
                                    </div>
                                    {formik.touched.make && formik.errors.make && (
                                        <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.make}</span>
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
                                        />
                                        <i className="fa-solid fa-car input-right-icon"></i>
                                    </div>
                                    {formik.touched.model && formik.errors.model && (
                                        <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.model}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label htmlFor="year">Manufacture Year</label>
                                <div className="input-with-icon">
                                    <input
                                        type="number"
                                        id="year"
                                        name="year"
                                        placeholder="Year (Eg: 2022)"
                                        value={formik.values.year}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={formik.touched.year && formik.errors.year ? 'error' : ''}
                                    />
                                    <i className="fa-solid fa-calendar-days input-right-icon"></i>
                                </div>
                                {formik.touched.year && formik.errors.year && (
                                    <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.year}</span>
                                )}
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
