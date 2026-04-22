import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { vehicleValidationSchema } from '../../../schemas/vehicle';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import DragDropUpload from '../../../components/Upload/DragDropUpload';
import getImageUrl from '../../../util/getImageUrl';
import { formatDate } from '../../../util/dateFormatter';
import defaultCarImg from '../../../assets/imgs/default-car.png';
import ServiceHistoryTimeline from '../../../components/Customer/ServiceHistoryTimeline/ServiceHistoryTimeline';
import './VehicleDetails.css';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [serviceHistory, setServiceHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchServiceHistory = async () => {
        try {
            setHistoryLoading(true);
            const response = await axios.get('/booking/my-history', {
                params: { vehicle: id }
            });
            console.log(response.data.payload.history);
            setServiceHistory(response.data.payload.history || []);
        } catch (error) {
            console.error("Failed to fetch service history:", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchVehicle();
            fetchServiceHistory();
        }
    }, [id, navigate]);
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
            setIsUpdating(true);
            try {
                let imageId = vehicle.image?._id;

                if (imageFile) {
                    const uploadData = new FormData();
                    uploadData.append('file', imageFile);
                    const uploadRes = await axios.post('/file', uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    imageId = uploadRes.data?.payload?.file?._id || uploadRes.data?.payload?.file?.id;
                }

                const payload = {
                    ...values,
                    image: imageId
                };

                const updateRes = await axios.put(`/vehicle/${id}`, payload);
                toast.success(updateRes?.data?.payload?.message || "Vehicle updated successfully");

                await fetchVehicle();
                setShowModal(false);
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.payload?.message || "Failed to update vehicle.");
            } finally {
                setIsUpdating(false);
            }
        }
    });

    const fetchVehicle = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/vehicle/${id}`);
            setVehicle(response.data.payload.vehicle);
        } catch (error) {
            toast.error(error.response?.data?.payload?.message || "Failed to load vehicle details.");
            navigate(-1);
        } finally {
            setLoading(false);
        }
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
        formik.setValues({
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year
        });
        setImagePreview(getImageUrl(vehicle.image?.filePath) || defaultCarImg);
        setImageFile(null);
        setShowModal(true);
    };

    const handleFileChange = (file) => {
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (loading || !vehicle) {
        return (
            <div className="customer-portal-wrapper">
                <Sidebar />
                <div className="customer-content-area">
                    <Header title="Customer Dashboard" />
                    <main className="vehicle-details-main">
                        <div className="loading-state-container">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <p>Loading vehicle details...</p>
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
                        <Link to="/customer/dashboard">
                            <i className="fa-solid fa-house"></i>
                            Dashboard
                        </Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <Link to="/customer/my-garage">Garage</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">{vehicle.make} {vehicle.model}</span>
                    </nav>

                    <section className="vehicle-hero-card">
                        <div className="hero-image-overlay"></div>
                        <img
                            src={getImageUrl(vehicle.image?.filePath) || defaultCarImg}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="hero-bg-img"
                        />

                        <div className="hero-content">
                            <div className="hero-meta-badges">
                                {/* <span className="status-badge active">ACTIVE</span> */}
                                <span className="meta-info"><i className="fa-regular fa-calendar"></i> {vehicle.year || 'N/A'}</span>
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
                                <div className="spec-item">
                                    <span className="spec-label">Manufacture Year</span>
                                    <span className="spec-value">{vehicle.year || 'N/A'}</span>
                                </div>
                                <div className="spec-item border-none">
                                    <span className="spec-label">Date Added</span>
                                    <span className="spec-value">{formatDate(vehicle.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <ServiceHistoryTimeline 
                            loading={historyLoading} 
                            history={serviceHistory} 
                            id={id} 
                            vehicle={vehicle}
                        />
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

                        <form onSubmit={formik.handleSubmit}>
                            <div className="modal-body">
                                <div className="modal-form-group">
                                    <label>VEHICLE IMAGE</label>
                                    <DragDropUpload
                                        onFileChange={handleFileChange}
                                        previewUrl={imagePreview}
                                        hintText="PNG, JPG up to 10MB"
                                    />
                                </div>

                                <div className="modal-form-row">
                                    <div className="modal-form-group">
                                        <label>LICENSE PLATE</label>
                                        <input
                                            type="text"
                                            name="licensePlate"
                                            value={formik.values.licensePlate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.licensePlate && formik.errors.licensePlate ? 'error' : ''}
                                        />
                                        {formik.touched.licensePlate && formik.errors.licensePlate && (
                                            <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.licensePlate}</span>
                                        )}
                                    </div>
                                    <div className="modal-form-group">
                                        <label>VEHICLE TYPE</label>
                                        <div className="modal-select-wrapper">
                                            <select
                                                name="type"
                                                value={formik.values.type}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={formik.touched.type && formik.errors.type ? 'error' : ''}
                                            >
                                                <option value="CAR">Car</option>
                                                <option value="VAN">Van</option>
                                                <option value="SUV">SUV</option>
                                                <option value="JEEP">Jeep</option>
                                            </select>
                                            <i className="fa-solid fa-chevron-down"></i>
                                        </div>
                                        {formik.touched.type && formik.errors.type && (
                                            <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.type}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="modal-form-row">
                                    <div className="modal-form-group">
                                        <label>MAKE</label>
                                        <input
                                            type="text"
                                            name="make"
                                            value={formik.values.make}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.make && formik.errors.make ? 'error' : ''}
                                        />
                                        {formik.touched.make && formik.errors.make && (
                                            <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.make}</span>
                                        )}
                                    </div>
                                    <div className="modal-form-group">
                                        <label>MODEL</label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={formik.values.model}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.model && formik.errors.model ? 'error' : ''}
                                        />
                                        {formik.touched.model && formik.errors.model && (
                                            <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.model}</span>
                                        )}
                                    </div>
                                    <div className="modal-form-group">
                                        <label>YEAR</label>
                                        <input
                                            type="number"
                                            name="year"
                                            value={formik.values.year}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={formik.touched.year && formik.errors.year ? 'error' : ''}
                                        />
                                        {formik.touched.year && formik.errors.year && (
                                            <span className="error-text" style={{ color: 'red', fontSize: '11px', fontWeight: 'bold' }}>{formik.errors.year}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)} disabled={isUpdating}>Cancel</button>
                                <button type="submit" className="modal-save-btn" disabled={isUpdating || !formik.isValid}>
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
