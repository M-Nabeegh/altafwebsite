import React, { useState, useEffect } from 'react';
import { doctorProfile, clinicHours } from '../data/content';
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

const BookingPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSundays, setAvailableSundays] = useState([]);

    // Generate upcoming Sundays
    useEffect(() => {
        const dates = [];
        let currentDate = new Date();
        // Start looking from tomorrow to avoid immediate booking issues or same-day if needed
        // But user wants "only Sunday".

        while (dates.length < 4) {
            currentDate.setDate(currentDate.getDate() + 1);
            if (currentDate.getDay() === 0) { // 0 is Sunday
                dates.push(new Date(currentDate));
            }
        }
        setAvailableSundays(dates);
    }, []);

    // Generate 20 min slots from 9:00 to 19:00
    const generateTimeSlots = () => {
        const slots = [];
        let startTime = 9 * 60; // 9:00 AM in minutes
        const endTime = 19 * 60; // 7:00 PM in minutes

        while (startTime < endTime) {
            const h = Math.floor(startTime / 60);
            const m = startTime % 60;
            const timeString = `${h > 12 ? h - 12 : h}:${m === 0 ? '00' : m} ${h >= 12 ? 'PM' : 'AM'}`;
            slots.push(timeString);
            startTime += 20;
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null); // Reset slot on date change
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleProceedToPayment = () => {
        window.open('https://buy.stripe.com/test_eVq4gza9yfge8Tl3d45ZC00', '_blank');
    };

    return (
        <div className="booking-page fade-in">
            <div className="container">
                <div className="booking-header text-center">
                    <h1>Book a Consultation</h1>
                    <p>Select a Sunday and time slot to book your appointment online using our secure payment system.</p>
                </div>

                <div className="booking-grid">
                    {/* Clinic Info (Existing) */}
                    <div className="info-card">
                        <h3>Clinic Information</h3>
                        <div className="info-item">
                            <FaMapMarkerAlt className="icon" />
                            <div><h4>Address</h4><p>{doctorProfile.address}</p></div>
                        </div>
                        <div className="info-item">
                            <FaPhone className="icon" />
                            <div><h4>Phone</h4><p>{doctorProfile.phone}</p></div>
                        </div>
                        <div className="info-item">
                            <FaEnvelope className="icon" />
                            <div><h4>Email</h4><p>{doctorProfile.email}</p></div>
                        </div>
                        <div className="schedule-section">
                            <h4><FaClock style={{ marginRight: '10px' }} /> Regular Hours</h4>
                            <ul className="hours-list">
                                {clinicHours.map((slot, index) => (
                                    <li key={index} className="hours-item">
                                        <span className="day">{slot.day}</span>
                                        <span className="time">{slot.time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* New Booking Flow */}
                    <div className="form-card booking-flow">
                        <h3><FaCalendarAlt className="mr-2" style={{ marginRight: '10px' }} /> Select Appointment</h3>

                        {/* Step 1: Date Selection */}
                        <div className="step-section">
                            <h4>1. Choose a Sunday</h4>
                            <div className="date-options">
                                {availableSundays.map((date, index) => (
                                    <button
                                        key={index}
                                        className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                                        onClick={() => handleDateSelect(date)}
                                    >
                                        {formatDate(date)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Time Selection */}
                        {selectedDate && (
                            <div className="step-section slide-down">
                                <h4>2. Choose a Time Slot (20 mins)</h4>
                                <div className="time-grid">
                                    {timeSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            className={`time-btn ${selectedSlot === slot ? 'active' : ''}`}
                                            onClick={() => handleSlotSelect(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {selectedDate && selectedSlot && (
                            <div className="step-section slide-down text-center payment-section">
                                <div className="summary-box">
                                    <h5>Booking Summary</h5>
                                    <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
                                    <p><strong>Time:</strong> {selectedSlot}</p>
                                    <p><strong>Consultation Fee:</strong> {doctorProfile.bookingFee}</p>
                                </div>

                                <button className="btn btn-primary btn-lg btn-payment" onClick={handleProceedToPayment}>
                                    <FaCreditCard className="mr-2" style={{ marginRight: '8px' }} /> Proceed to Payment
                                </button>
                                <p className="secure-text"><small>Functionality powered by Stripe. Secure Payment.</small></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .booking-page {
                    padding: 120px 0 80px;
                    background: var(--light-gray);
                    min-height: 80vh;
                }

                .booking-header {
                    margin-bottom: 50px;
                }

                .booking-header h1 {
                    color: var(--primary-dark);
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .booking-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr; /* Gave more space to booking column */
                    gap: 40px;
                }

                .info-card, .form-card {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }

                .info-card h3, .form-card h3 {
                    color: var(--primary-dark);
                    margin-bottom: 30px;
                    border-bottom: 2px solid var(--light-gray);
                    padding-bottom: 15px;
                }

                .info-item {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .info-item .icon {
                    color: var(--primary-color);
                    font-size: 1.2rem;
                    margin-top: 5px;
                }

                .info-item h4 {
                    font-size: 1rem;
                    color: var(--primary-dark);
                    margin-bottom: 5px;
                }

                .info-item p {
                    color: var(--text-light);
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .schedule-section {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }

                .hours-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                    font-size: 0.9rem;
                    color: var(--text-dark);
                }

                /* Booking Step Styles */
                .step-section {
                    margin-bottom: 30px;
                }

                .step-section h4 {
                    font-size: 1.1rem;
                    color: var(--primary-color);
                    margin-bottom: 15px;
                    font-weight: 600;
                }

                .date-options {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                }

                .date-btn {
                    padding: 12px;
                    border: 1px solid #ddd;
                    background: #f9f9f9;
                    border-radius: 6px;
                    font-weight: 500;
                    text-align: left;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .date-btn:hover {
                    border-color: var(--primary-color);
                    background: white;
                }

                .date-btn.active {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .time-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 10px;
                }

                .time-btn {
                    padding: 8px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .time-btn:hover {
                    border-color: var(--primary-color);
                }

                .time-btn.active {
                    background: var(--accent-color);
                    color: var(--primary-dark);
                    border-color: var(--accent-color);
                    font-weight: 600;
                }

                .summary-box {
                    background: #f0fdf4;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #bbf7d0;
                    margin-bottom: 20px;
                    text-align: left;
                }
                
                .summary-box h5 {
                    color: #166534;
                    margin-bottom: 10px;
                    font-weight: 700;
                }

                .summary-box p {
                    margin-bottom: 5px;
                    color: #14532d;
                }

                .btn-payment {
                    width: 100%;
                    padding: 15px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .slide-down {
                    animation: slideDown 0.3s ease forwards;
                }

                @media (max-width: 768px) {
                    .booking-grid {
                        grid-template-columns: 1fr;
                    }
                    .booking-page {
                        padding-top: 100px;
                    }
                    .time-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingPage;
