import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/Customer/SideBar/CustomerSidebar';
import Header from '../../../components/Customer/Header/CustomerHeader';
import './ServiceBooking.css';

const ServiceBooking = () => {
    const [selectedDate, setSelectedDate] = useState(6);
    const [selectedSlot, setSelectedSlot] = useState(1);

    const timeSlots = [
        { id: 1, time: '09:00 AM - 01:00 PM', label: 'Morning Session' },
        { id: 2, time: '10:30 AM - 02:30 PM', label: 'Mid-Morning Session' },
        { id: 3, time: '01:00 PM - 05:00 PM', label: 'Afternoon Session' },
        { id: 4, time: '02:30 PM - 06:30 PM', label: 'Late Afternoon Session' },
    ];

    const calendarDays = [
        null, null, null, null, null, 1, 2, 3, 4,
        5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31
    ];

    return (
        <div className="customer-portal-wrapper">
            <Sidebar />

            <div className="customer-content-area">
                <Header title="Customer Dashboard" />

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

                    {/* Calendar Section */}
                    <div className="calendar-card">
                        <div className="calendar-header">
                            <h3 className="month-year">
                                <i className="fa-regular fa-calendar-days"></i>
                                October 2023
                            </h3>
                            <div className="calendar-nav">
                                <button className="nav-btn"><i className="fa-solid fa-chevron-left"></i></button>
                                <button className="nav-btn"><i className="fa-solid fa-chevron-right"></i></button>
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

                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`calendar-day ${day === null ? 'empty' : ''} ${day === selectedDate ? 'selected' : ''} ${day === 17 ? 'unavailable' : ''}`}
                                    onClick={() => day !== null && day !== 17 && setSelectedDate(day)}
                                >
                                    {day}
                                </div>
                            ))}
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

                    {/* Slots and Summary Grid */}
                    <div className="slots-summary-grid">
                        {/* Time Slots Selection */}
                        <div className="time-slots-section">
                            <div className="section-title">
                                <i className="fa-regular fa-clock"></i>
                                <span>Available Time Slots</span>
                            </div>
                            <div className="slots-list">
                                {timeSlots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className={`slot-card ${selectedSlot === slot.id ? 'active' : ''}`}
                                        onClick={() => setSelectedSlot(slot.id)}
                                    >
                                        <div className="slot-info">
                                            <h4>{slot.time}</h4>
                                            <p>{slot.label}</p>
                                        </div>
                                        <div className="slot-check">
                                            {selectedSlot === slot.id ? (
                                                <i className="fa-solid fa-circle-check"></i>
                                            ) : (
                                                <i className="fa-regular fa-circle-plus"></i>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                        <span className="label">Service</span>
                                        <span className="value">Ultimate Exterior Detailing</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Date</span>
                                        <span className="value">Friday, Oct 6th, 2023</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Time</span>
                                        <span className="value">09:00 AM</span>
                                    </div>
                                </div>

                                <div className="estimate-row">
                                    <span className="label">Total Estimate</span>
                                    <span className="price">$189.00</span>
                                </div>

                                <button className="confirm-booking-btn">
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
