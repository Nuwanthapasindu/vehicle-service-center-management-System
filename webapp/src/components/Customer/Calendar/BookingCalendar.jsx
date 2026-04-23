import React, { useState } from 'react';
import './BookingCalendar.css';

const BookingCalendar = ({ selectedDate, onDateSelect }) => {
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

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

    const nextDayStart = new Date(todayStart);
    nextDayStart.setDate(todayStart.getDate() + 1);

    const maxDate = new Date(todayStart);
    maxDate.setDate(todayStart.getDate() + 30);

    const isDateUnavailable = (day) => {
        if (!day) return true;
        const dateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
        if (dateObj < nextDayStart) return true; // Disable today and past days
        if (dateObj > maxDate) return true; // Disabled days beyond 30 days
        if (dateObj.getDay() === 1) return true; // Disabled Mondays
        return false;
    };

    const handleDateSelection = (day) => {
        if (isDateUnavailable(day)) return;
        const selected = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
        onDateSelect(selected);
    };

    const changeMonth = (offset) => {
        setCurrentMonthDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="calendar-card">
            <div className="calendar-header">
                <h3 className="month-year">
                    <i className="fa-regular fa-calendar-days"></i>
                    {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                </h3>
                <div className="calendar-nav">
                    <button className="nav-btn" onClick={() => changeMonth(-1)} type="button">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="nav-btn" onClick={() => changeMonth(1)} type="button">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
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
    );
};

export default BookingCalendar;
