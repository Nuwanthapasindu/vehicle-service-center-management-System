import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './ServiceBooking.css';

const ServiceBooking = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(1);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('/vehicle/my-vehicles');
                setVehicles(response.data.payload.vehicles || []);
            } catch (error) {
                console.error("Failed to fetch vehicles", error);
            }
        };
        fetchVehicles();
    }, []);

    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setLoadingSlots(true);
            try {
                const yyyy = selectedDate.getFullYear();
                const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const dd = String(selectedDate.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                const response = await axios.get(`/timeslot?date=${dateStr}`);
                setTimeSlots(response.data.payload.slots || []);
                setSelectedSlot(null);
            } catch (error) {
                console.error("Failed to fetch timeslots", error);
                toast.error("Failed to fetch timeslots");
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [selectedDate]);

    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedVehicle || !selectedSlot) return;

        try {
            const yyyy = selectedDate.getFullYear();
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            const slotDetails = timeSlots.find(s => s.id === selectedSlot);

            await axios.post('/booking', {
                vehicle: selectedVehicle._id,
                slot: selectedSlot,
                date: dateStr
            });

            toast.success(`Booking confirmed for ${selectedVehicle.make} ${selectedVehicle.model} on ${dateStr} at ${slotDetails?.time.split(' - ')[0]}`);

            // Reset fields
            setSelectedDate(null);
            setSelectedSlot(null);
            setSelectedVehicle(null);

            // Navigate away if desired, or stay here with the fresh page
            // navigate('/customer/dashboard'); 
        } catch (error) {
            console.error("Booking failed", error);
            toast.error(error.response?.data?.payload?.message || "Failed to confirm booking.");
        }
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonthDate.getFullYear(), currentMonthDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonthDate.getFullYear(), currentMonthDate.getMonth());

    const calendarDays = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const isDateUnavailable = (day) => {
        if (!day) return true;
        const dateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
        if (dateObj < todayStart) return true;
        if (dateObj.getDay() === 1) return true; // Disabled Mondays
        return false;
    };

    const handleDateSelection = (day) => {
        if (isDateUnavailable(day)) return;
        const selected = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
        setSelectedDate(selected);
    };

    const changeMonth = (offset) => {
        setCurrentMonthDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const getImageUrl = (imageObj) => {
        if (imageObj && imageObj.fileName) {
            return `${import.meta.env.VITE_SERVER_URL}/storage/uploads/${imageObj.fileName}`;
        }
        return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80";
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Service Booking" />

                <main className="booking-main-content">
                    {/* Breadcrumbs */}
                    <nav className="breadcrumbs">
                        <Link to="/customer/dashboard">Home</Link>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span>Booking</span>
                        <i className="fa-solid fa-chevron-right"></i>
                        <span className="active">Select Slot</span>
                    </nav>

                    {/* Page Header */}
                    <section className="page-title-section">
                        <h2 className="page-title">Book a Service Slot</h2>
                        <p className="page-subtitle">
                            Select your preferred date and time for a premium professional detailing session. Our master technicians will ensure your vehicle looks brand new.
                        </p>
                    </section>

                    {/* Info Cards Row */}
                    <div className="booking-info-cards-row">
                        <div className="info-mini-card">
                            <div className="card-icon-box">
                                <i className="fa-solid fa-shield-check"></i>
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
                        <div className="calendar-card">
                            <div className="calendar-header">
                                <h3 className="month-year">
                                    <i className="fa-regular fa-calendar-days"></i>
                                    {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                                </h3>
                                <div className="calendar-nav">
                                    <button className="nav-btn" onClick={() => changeMonth(-1)}><i className="fa-solid fa-chevron-left"></i></button>
                                    <button className="nav-btn" onClick={() => changeMonth(1)}><i className="fa-solid fa-chevron-right"></i></button>
                                </div>
                            </div>

                            <div className="calendar-grid">
                                <div className="day-name">SUN</div>
                                <div className="day-name">MON</div>
                                <div className="day-name">TUE</div>
                                <div className="day-name">WED</div>
                                <div className="day-name">THU</div>
                                <div className="day-name">FRI</div>
                                <div className="day-name">SAT</div>

                                {calendarDays.map((day, index) => {
                                    const unavailable = isDateUnavailable(day);
                                    let isSelected = false;
                                    if (day && selectedDate) {
                                        isSelected = selectedDate.getDate() === day &&
                                            selectedDate.getMonth() === currentMonthDate.getMonth() &&
                                            selectedDate.getFullYear() === currentMonthDate.getFullYear();
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className={`calendar-day ${day === null ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${unavailable && day !== null ? 'unavailable' : ''}`}
                                            onClick={() => handleDateSelection(day)}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="calendar-legend">
                                <div className="legend-item">
                                    <span className="dot selected"></span>
                                    <span>Selected</span>
                                </div>
                                <div className="legend-item">
                                    <span className="dot available"></span>
                                    <span>Available</span>
                                </div>
                                <div className="legend-item">
                                    <span className="dot unavailable"></span>
                                    <span>Not Available</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Picker Section */}
                        <div className="vehicle-picker-card">
                            <div className="vehicle-picker-header">
                                <h3>Select Vehicle</h3>
                            </div>
                            <div className="vehicle-row-list">
                                {vehicles.length === 0 ? (
                                    <div className="no-vehicles-message">
                                        <p>No vehicles found. Please add a vehicle in your garage.</p>
                                        <Link to="/customer/my-garage" className="goto-garage-btn">Go to Garage</Link>
                                    </div>
                                ) : (
                                    vehicles.map(v => (
                                        <div
                                            key={v._id}
                                            className={`vehicle-pick-item ${selectedVehicle?._id === v._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedVehicle(v)}
                                        >
                                            <div className="vehicle-pick-img-wrapper">
                                                <img src={getImageUrl(v.image)} alt={v.model} />
                                            </div>
                                            <div className="vehicle-pick-info">
                                                <h4>{v.make} {v.model}</h4>
                                                <span>{v.year || v.type}</span>
                                            </div>
                                            <div className="vehicle-check">
                                                {selectedVehicle?._id === v._id ? (
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
                            <div className="section-title">
                                <i className="fa-regular fa-clock"></i>
                                <span>Available Time Slots</span>
                            </div>
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
                                                    if (!disabled) setSelectedSlot(slot.id);
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
                        </div>

                        {/* Booking Summary */}
                        <div className="booking-summary-sidebar">
                            <div className="summary-card">
                                <h4 className="summary-title">BOOKING SUMMARY</h4>
                                <div className="summary-details">
                                    <div className="detail-row">
                                        <span className="label">Vehicle</span>
                                        <span className="value">{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Not selected'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Date</span>
                                        <span className="value">
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
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
