import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './ServiceBooking.css';
import getImageUrl from '../../../util/getImageUrl';
import defaultCarImg from '../../../assets/imgs/default-car.png';
import { useFormik } from 'formik';
import { bookingSchema } from '../../../schemas/booking';
import { formatLongDate } from '../../../util/dateFormatter';
import BookingCalendar from '../../../components/Customer/Calendar/BookingCalendar';

const ServiceBooking = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);

    const formik = useFormik({
        initialValues: {
            vehicleId: '',
            slotId: '',
            date: null
        },
        validationSchema: bookingSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const yyyy = values.date.getFullYear();
                const mm = String(values.date.getMonth() + 1).padStart(2, '0');
                const dd = String(values.date.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                const slotDetails = timeSlots.find(s => s.id === values.slotId);

                await axios.post('/booking', {
                    vehicle: values.vehicleId,
                    slot: values.slotId,
                    date: dateStr
                });

                const vehicleDetails = vehicles.find(v => v._id === values.vehicleId);
                toast.success(`Booking confirmed for ${vehicleDetails.make} ${vehicleDetails.model} on ${dateStr} at ${slotDetails?.time.split(' - ')[0]}`);

                resetForm();
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || "Failed to confirm booking.");
            }
        }
    });

    const { values, errors, setFieldValue, submitForm } = formik;
    const selectedDate = values.date;
    const selectedSlot = values.slotId;
    const selectedVehicle = vehicles.find(v => v._id === values.vehicleId);

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoadingVehicles(true);
                const response = await axios.get('/vehicle/my-vehicles');
                setVehicles(response.data.payload.vehicles || []);
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || "Failed to fetch vehicles.");
            } finally {
                setLoadingVehicles(false);
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            setFieldValue('slotId', ''); // Reset slot selection
            return;
        }

        const fetchSlots = async () => {
            setLoadingSlots(true);
            try {
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                const response = await axios.get(`/timeslot/available?date=${dateStr}`);
                setTimeSlots(response.data.payload.slots || []);
                setFieldValue('slotId', ''); // Reset slot selection when date changes
            } catch (error) {
                toast.error(error.response?.data?.payload?.message || "Failed to fetch timeslots.");
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [selectedDate, setFieldValue]);

    const handleConfirmBooking = () => submitForm();


    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Service Booking" />

                <main className="booking-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <Link to="/customer/dashboard">
                            <i className="fa-solid fa-house"></i>
                            Dashboard
                        </Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Service Booking</span>
                    </nav>

                    {/* Page Header */}
                    <section className="page-title-section">
                        <h1 className="page-title">Book a Service Slot</h1>
                        <p className="page-subtitle">
                            Select your preferred date and time for a premium professional detailing session. Our master technicians will ensure your vehicle looks brand new.
                        </p>
                    </section>

                    {/* Info Cards Row */}
                    <div className="booking-info-cards-row">
                        <div className="info-mini-card">
                            <div className="card-icon-box">
                                <i className="fa-solid fa-shield-halved"></i>

                            </div>
                            <div className="card-text">
                                <h5>Quality Guarantee</h5>
                                <p>Every service includes a 100% satisfaction guarantee or we re-detail for free.</p>
                            </div>
                        </div>
                        <div className="info-mini-card">
                            <div className="card-icon-box">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <div className="card-text">
                                <h5>Central Hub Location</h5>
                                <p>Easily accessible facility at 122 Industrial Way with premium waiting lounge.</p>
                            </div>
                        </div>
                        <div className="info-mini-card">
                            <div className="card-icon-box">
                                <i className="fa-regular fa-bell"></i>
                            </div>
                            <div className="card-text">
                                <h5>Instant Reminders</h5>
                                <p>Get SMS reminders 24 hours before your scheduled arrival.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pickers Row */}
                    <div className="picker-row">
                        {/* Calendar Section */}
                        <BookingCalendar
                            selectedDate={selectedDate}
                            onDateSelect={(date) => setFieldValue('date', date)}
                        />

                        {/* Vehicle Picker Section */}
                        <div className="vehicle-picker-card">
                            <div className="vehicle-picker-header">
                                <h2 className="section-title">Select Vehicle</h2>
                            </div>
                            <div className="vehicle-row-list">
                                {loadingVehicles ? (
                                    <div className="loading-state-container">
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        <p>Loading your vehicles...</p>
                                    </div>
                                ) : vehicles.length === 0 ? (
                                    <div className="empty-state-container">
                                        <div className="empty-state-icon">
                                            <i className="fa-solid fa-car-rear"></i>
                                        </div>
                                        <p className="empty-state-text">No records found.</p>
                                        <Link to="/customer/my-garage" className="empty-state-btn">Add Vehicle</Link>
                                    </div>
                                ) : (
                                    vehicles.map(v => (
                                        <div
                                            key={v._id}
                                            className={`vehicle-pick-item ${values.vehicleId === v._id ? 'selected' : ''}`}
                                            onClick={() => setFieldValue('vehicleId', v._id)}
                                        >
                                            <div className="vehicle-pick-img-wrapper">
                                                <img src={getImageUrl(v.image?.filePath) || defaultCarImg} alt={v.model} />
                                            </div>
                                            <div className="vehicle-pick-info">
                                                <h4>{v.make} {v.model}</h4>
                                                <span>{v.year || 'N/A'} • {v.type}</span>
                                            </div>
                                            <div className="vehicle-check">
                                                {values.vehicleId === v._id ? (
                                                    <i className="fa-solid fa-circle-check"></i>
                                                ) : (
                                                    <i className="fa-regular fa-circle"></i>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Slots and Summary Grid */}
                    <div className="slots-summary-grid">
                        {/* Time Slots Selection */}
                        <div className="time-slots-section">
                            <h2 className="section-title">
                                <i className="fa-regular fa-clock"></i>
                                Available Time Slots
                            </h2>
                            <div className="slots-list">
                                {!selectedDate ? (
                                    <div className="booking-note-alert" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                                        <i className="fa-regular fa-calendar" style={{ color: '#64748B' }}></i>
                                        <p>Please select a date first to view available time slots.</p>
                                    </div>
                                ) : loadingSlots ? (
                                    <div className="booking-note-alert" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                                        <i className="fa-solid fa-spinner fa-spin" style={{ color: '#64748B' }}></i>
                                        <p>Loading available slots...</p>
                                    </div>
                                ) : timeSlots.length === 0 ? (
                                    <div className="booking-note-alert" style={{ backgroundColor: '#FFF5F5', borderColor: '#FED7D7' }}>
                                        <i className="fa-solid fa-circle-exclamation" style={{ color: '#E53E3E' }}></i>
                                        <p>No time slots available for this date.</p>
                                    </div>
                                ) : (
                                    timeSlots.map((slot) => {
                                        const disabled = slot.isFull || !selectedVehicle;
                                        return (
                                            <div
                                                key={slot.id}
                                                className={`slot-card ${selectedSlot === slot.id ? 'active' : ''}`}
                                                style={disabled ? { opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#F1F5F9' } : {}}
                                                onClick={() => {
                                                    if (!disabled) setFieldValue('slotId', slot.id);
                                                    else if (!selectedVehicle) toast.warning("Please select a vehicle first.");
                                                }}
                                            >
                                                <div className="slot-info">
                                                    <h4>{slot.time}</h4>
                                                    <p style={{ color: slot.isFull ? '#E53E3E' : 'var(--secondary)' }}>
                                                        {slot.isFull ? 'Fully Booked' : `${slot.maxCapacity - slot.booked} slots remaining`}
                                                    </p>
                                                </div>
                                                <div className="slot-check">
                                                    {selectedSlot === slot.id ? (
                                                        <i className="fa-solid fa-circle-check"></i>
                                                    ) : slot.isFull ? (
                                                        <i className="fa-solid fa-ban" style={{ color: '#E53E3E' }}></i>
                                                    ) : (
                                                        <i className="fa-regular fa-circle-plus"></i>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="booking-note-alert">
                                <i className="fa-solid fa-circle-info"></i>
                                <p>Most detailing services take approximately <strong>4 hours</strong>. Please ensure your vehicle is dropped off at least 15 minutes before your slot.</p>
                            </div>

                            <div className="booking-note-alert" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A', marginTop: '12px' }}>
                                <i className="fa-solid fa-phone" style={{ color: '#D97706' }}></i>
                                <p style={{ color: '#92400E' }}><strong>Modifications:</strong> Online cancellations or changes are not permitted. If you need to make changes to your booking, please call our service center at <strong>+94 77 767 3368</strong>.</p>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="booking-summary-sidebar">
                            <div className="summary-card">
                                <h4 className="summary-title">BOOKING SUMMARY</h4>
                                <div className="summary-details">
                                    <div className="detail-row">
                                        <span className="label">Vehicle</span>
                                        <span className="value">
                                            {selectedVehicle
                                                ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year || 'N/A'})`
                                                : 'Not selected'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Date</span>
                                        <span className="value">
                                            {selectedDate
                                                ? formatLongDate(selectedDate)
                                                : 'Not selected'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Time</span>
                                        <span className="value">
                                            {timeSlots.find(s => s.id === selectedSlot)?.time.split(' - ')[0] || 'Not selected'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="confirm-booking-btn"
                                    disabled={!selectedDate || !selectedVehicle || !selectedSlot}
                                    style={{ opacity: (!selectedDate || !selectedVehicle || !selectedSlot) ? 0.5 : 1, cursor: (!selectedDate || !selectedVehicle || !selectedSlot) ? 'not-allowed' : 'pointer', marginTop: '1.5rem' }}
                                    onClick={handleConfirmBooking}
                                >
                                    <span>CONFIRM BOOKING</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                                <p className="no-payment-text">NO PAYMENT REQUIRED TODAY</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ServiceBooking;
