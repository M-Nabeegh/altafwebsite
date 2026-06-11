import React, { useState } from 'react';
import { doctorProfile } from '../data/content';
import { FaCalendarAlt, FaClock, FaCreditCard, FaLock, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const BookingPage = () => {
    // Form and Booking States
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [patientNotes, setPatientNotes] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of 20-minute time slots between 10:00 AM and 12:00 PM
    const timeSlots = [
        "10:00 AM - 10:20 AM",
        "10:20 AM - 10:40 AM",
        "10:40 AM - 11:00 AM",
        "11:00 AM - 11:20 AM",
        "11:20 AM - 11:40 AM",
        "11:40 AM - 12:00 PM"
    ];

    // Calendar Helper Functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const isSaturday = (date) => {
        return date.getDay() === 6; // 6 is Saturday
    };

    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateSelectable = (date) => {
        return isSaturday(date) && !isPastDate(date);
    };

    const handleDateClick = (day) => {
        if (!day) return;
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (isDateSelectable(clickedDate)) {
            setSelectedDate(clickedDate);
            setSelectedTimeSlot(''); // reset slot when date changes
        }
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        
        if (!selectedDate) {
            alert("Please select an appointment date from the calendar.");
            return;
        }
        if (!selectedTimeSlot) {
            alert("Please select an appointment time slot.");
            return;
        }
        if (!patientName.trim()) {
            alert("Please enter patient's full name.");
            return;
        }
        if (!patientEmail.trim()) {
            alert("Please enter patient's email address.");
            return;
        }
        if (!patientPhone.trim()) {
            alert("Please enter patient's phone number.");
            return;
        }
        if (!agreed) {
            alert("Please agree to the pricing, terms, and policies to proceed.");
            return;
        }

        setIsSubmitting(true);

        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Store selected details in localStorage for retrieval on the thank you page
        const bookingData = {
            patientName: patientName,
            patientEmail: patientEmail,
            patientPhone: patientPhone,
            patientNotes: patientNotes,
            selectedDate: formattedDate,
            selectedTimeSlot: selectedTimeSlot,
            fee: 'PKR 4,000'
        };

        localStorage.setItem('pending_booking', JSON.stringify(bookingData));

        // Redirect to Stripe checkout page
        // Wait, stripe link should be opened in the same window so the redirect redirect works.
        window.location.href = 'https://buy.stripe.com/test_eVq4gza9yfge8Tl3d45ZC00';
    };

    // Calendar Generation
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentMonth);
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const currentYear = currentMonth.getFullYear();

    const calendarCells = [];
    // Previous month padding cells
    for (let i = 0; i < firstDayIndex; i++) {
        calendarCells.push(null);
    }
    // Current month cells
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push(i);
    }

    return (
        <div className="booking-page fade-in">
            <SEO 
                title="Book Consultation | Prof. Dr. Javed Altaf" 
                description="Book your online consultation or in-person appointment with Prof. Dr. Javed Altaf securely." 
                keywords="book consultation, urologist appointment Hyderabad, Dr Javed Altaf booking, online doctor Hyderabad"
                url="https://www.javedaltaf.com/booking"
            />
            <div className="container">
                <div className="booking-header text-center">
                    <h1>Book an Online Consultation</h1>
                    <p>Select a Saturday slot for a personalized, secure 20-minute urological consultation.</p>
                </div>

                <div className="booking-layout-grid">
                    {/* Left Column: Info Card */}
                    <div className="booking-info-sidebar">
                        <h3>Consultation Details</h3>

                        <div className="detail-row">
                            <FaCalendarAlt className="sidebar-icon" />
                            <div>
                                <h5>Consultation Day</h5>
                                <p>Saturdays Only</p>
                                <span className="highlight-text">Pre-booking Required</span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <FaClock className="sidebar-icon" />
                            <div>
                                <h5>Hours Available</h5>
                                <p>10:00 AM - 12:00 PM</p>
                                <span className="badge-duration">20 Minute Slots</span>
                            </div>
                        </div>

                        <div className="detail-row">
                            <FaCreditCard className="sidebar-icon" />
                            <div>
                                <h5>Consultation Fee</h5>
                                <p className="fee-amount">PKR 4,000</p>
                                <span className="highlight-text">Secure Stripe Payment</span>
                            </div>
                        </div>

                        <div className="security-badge">
                            <FaLock className="lock-icon" />
                            <p>All payments are securely encrypted and processed via Stripe.</p>
                        </div>
                    </div>

                    {/* Right Column: Interactive Calendar & Details Form */}
                    <div className="booking-interactive-card">
                        <form onSubmit={handleProceedToPayment}>
                            {/* Step 1: Select Date */}
                            <div className="booking-step">
                                <h4 className="step-title"><span>1</span> Select Date (Saturdays Only)</h4>
                                
                                <div className="calendar-container">
                                    <div className="calendar-header">
                                        <button type="button" className="cal-nav-btn" onClick={handlePrevMonth} aria-label="Previous Month">
                                            <FaChevronLeft />
                                        </button>
                                        <h4>{monthName} {currentYear}</h4>
                                        <button type="button" className="cal-nav-btn" onClick={handleNextMonth} aria-label="Next Month">
                                            <FaChevronRight />
                                        </button>
                                    </div>

                                    <div className="calendar-weekdays">
                                        <div>Sun</div>
                                        <div>Mon</div>
                                        <div>Tue</div>
                                        <div>Wed</div>
                                        <div>Thu</div>
                                        <div>Fri</div>
                                        <div>Sat</div>
                                    </div>

                                    <div className="calendar-days-grid">
                                        {calendarCells.map((day, index) => {
                                            if (day === null) {
                                                return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                                            }

                                            const cellDate = new Date(currentYear, currentMonth.getMonth(), day);
                                            const selectable = isDateSelectable(cellDate);
                                            const isSelected = selectedDate && 
                                                selectedDate.getDate() === day && 
                                                selectedDate.getMonth() === currentMonth.getMonth() && 
                                                selectedDate.getFullYear() === currentYear;

                                            let dayClass = "calendar-day";
                                            if (selectable) dayClass += " selectable";
                                            if (isSelected) dayClass += " selected";
                                            if (!selectable && !isSaturday(cellDate)) dayClass += " disabled-weekday";
                                            if (isPastDate(cellDate) && isSaturday(cellDate)) dayClass += " disabled-past-sat";

                                            return (
                                                <button
                                                    key={`day-${day}`}
                                                    type="button"
                                                    className={dayClass}
                                                    disabled={!selectable}
                                                    onClick={() => handleDateClick(day)}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div className="selected-date-indicator">
                                        Selected: <strong>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Select Time Slot */}
                            {selectedDate && (
                                <div className="booking-step fade-in">
                                    <h4 className="step-title"><span>2</span> Select Consultation Time</h4>
                                    <div className="slots-grid">
                                        {timeSlots.map((slot) => {
                                            const isSelected = selectedTimeSlot === slot;
                                            return (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    className={`slot-pill ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedTimeSlot(slot)}
                                                >
                                                    {isSelected && <FaCheck className="slot-check" />}
                                                    {slot.split(' - ')[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Patient Form Details */}
                            {selectedDate && selectedTimeSlot && (
                                <div className="booking-step fade-in">
                                    <h4 className="step-title"><span>3</span> Patient Information</h4>
                                    
                                    <div className="form-group">
                                        <label htmlFor="patientName">Patient's Full Name <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            id="patientName"
                                            className="form-control"
                                            placeholder="Enter full name"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-row-grid">
                                        <div className="form-group">
                                            <label htmlFor="patientEmail">Email Address <span className="required">*</span></label>
                                            <input
                                                type="email"
                                                id="patientEmail"
                                                className="form-control"
                                                placeholder="example@mail.com"
                                                value={patientEmail}
                                                onChange={(e) => setPatientEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="patientPhone">WhatsApp / Mobile Number <span className="required">*</span></label>
                                            <input
                                                type="tel"
                                                id="patientPhone"
                                                className="form-control"
                                                placeholder="e.g. 0300-1234567"
                                                value={patientPhone}
                                                onChange={(e) => setPatientPhone(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="patientNotes">Describe Symptoms / Medical Issue (Optional)</label>
                                        <textarea
                                            id="patientNotes"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Provide a brief explanation of urological complaints, reports to review, etc."
                                            value={patientNotes}
                                            onChange={(e) => setPatientNotes(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <div className="legal-agreement-box">
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={agreed}
                                                onChange={() => setAgreed(!agreed)}
                                                required
                                            />
                                            <span className="checkbox-text">
                                                I agree to the <Link to="/pricing" target="_blank">Pricing</Link>, <Link to="/terms-and-conditions" target="_blank">Terms & Conditions</Link>, and <Link to="/refund-policy" target="_blank">Refund & Cancellation Policy</Link>, and acknowledge that appointments are booked upon successful payment of PKR 4,000.
                                            </span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-primary btn-block btn-pay-submit ${isSubmitting ? 'submitting' : ''}`}
                                        disabled={!agreed || isSubmitting}
                                    >
                                        {isSubmitting ? 'Redirecting to Secure Payment...' : 'Proceed to Pay & Book (PKR 4,000)'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .booking-page {
                    padding: 160px 0 80px;
                    background: var(--light-gray);
                    min-height: 95vh;
                }

                .booking-header {
                    margin-bottom: 50px;
                }

                .booking-header h1 {
                    color: var(--primary-dark);
                    font-size: 2.6rem;
                    margin-bottom: 12px;
                }

                .booking-header p {
                    font-size: 1.1rem;
                    color: var(--text-light);
                }

                .booking-layout-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.8fr;
                    gap: 40px;
                    max-width: 1150px;
                    margin: 0 auto;
                    align-items: start;
                }

                .booking-info-sidebar {
                    background: var(--primary-dark);
                    color: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                }

                .booking-info-sidebar h3 {
                    color: white;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                    font-size: 1.4rem;
                }

                .detail-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .sidebar-icon {
                    font-size: 1.25rem;
                    color: var(--accent-color);
                    margin-top: 4px;
                }

                .detail-row h5 {
                    color: white;
                    font-size: 1.05rem;
                    margin-bottom: 4px;
                }

                .detail-row p {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 0.95rem;
                    margin: 0;
                }

                .fee-amount {
                    font-size: 1.35rem !important;
                    font-weight: 700;
                    color: var(--accent-color) !important;
                }

                .highlight-text {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.55);
                    display: block;
                    margin-top: 2px;
                }

                .badge-duration {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    padding: 3px 10px;
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    display: inline-block;
                    margin-top: 4px;
                }

                .consultation-includes {
                    margin-top: 35px;
                    padding: 20px 0;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .consultation-includes h5 {
                    color: white;
                    margin-bottom: 12px;
                    font-size: 1rem;
                }

                .consultation-includes ul {
                    padding-left: 20px;
                    list-style-type: disc;
                }

                .consultation-includes li {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                    line-height: 1.4;
                }

                .security-badge {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                }

                .lock-icon {
                    color: var(--accent-color);
                    font-size: 1rem;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .security-badge p {
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.65);
                    margin: 0;
                    line-height: 1.4;
                }

                .booking-interactive-card {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }

                .booking-step {
                    margin-bottom: 35px;
                    border-bottom: 1px solid var(--medium-gray);
                    padding-bottom: 30px;
                }

                .booking-step:last-of-type {
                    border-bottom: none;
                    padding-bottom: 0;
                    margin-bottom: 0;
                }

                .step-title {
                    font-size: 1.25rem;
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .step-title span {
                    background: var(--primary-color);
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    font-weight: 700;
                }

                /* Calendar Styles */
                .calendar-container {
                    border: 1px solid var(--medium-gray);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    max-width: 450px;
                    background: white;
                }

                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--secondary-color);
                    padding: 15px 20px;
                    border-bottom: 1px solid var(--medium-gray);
                }

                .calendar-header h4 {
                    margin: 0;
                    color: var(--primary-dark);
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .cal-nav-btn {
                    background: none;
                    border: none;
                    color: var(--primary-color);
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .cal-nav-btn:hover {
                    background: rgba(0, 86, 179, 0.08);
                }

                .calendar-weekdays {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    text-align: center;
                    font-weight: 600;
                    font-size: 0.8rem;
                    color: var(--text-light);
                    padding: 10px 0;
                    background: var(--white);
                    border-bottom: 1px solid var(--light-gray);
                }

                .calendar-days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 4px;
                    padding: 10px;
                }

                .calendar-day {
                    background: none;
                    border: none;
                    aspect-ratio: 1;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-light);
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    cursor: not-allowed;
                }

                .calendar-day.empty {
                    cursor: default;
                }

                .calendar-day.disabled-weekday {
                    color: #d1d5db;
                }

                .calendar-day.disabled-past-sat {
                    color: #f3a6a6;
                    text-decoration: line-through;
                }

                .calendar-day.selectable {
                    color: var(--primary-color);
                    font-weight: 700;
                    border: 1.5px solid rgba(0, 86, 179, 0.3);
                    background: rgba(0, 86, 179, 0.02);
                    cursor: pointer;
                }

                .calendar-day.selectable:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: scale(1.05);
                }

                .calendar-day.selected {
                    background: var(--primary-color) !important;
                    color: white !important;
                    border-color: var(--primary-color) !important;
                    box-shadow: var(--shadow-sm);
                }

                .selected-date-indicator {
                    margin-top: 15px;
                    padding: 10px 15px;
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: var(--radius-sm);
                    color: #166534;
                    font-size: 0.9rem;
                    display: inline-block;
                }

                /* Slots Grid */
                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 12px;
                }

                .slot-pill {
                    background: white;
                    border: 1.5px solid var(--medium-gray);
                    color: var(--text-dark);
                    padding: 12px 10px;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .slot-pill:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                    background: var(--secondary-color);
                }

                .slot-pill.selected {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-sm);
                }

                .slot-check {
                    font-size: 0.8rem;
                }

                /* Form Styles */
                .form-group {
                    margin-bottom: 20px;
                }

                .form-row-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                label {
                    display: block;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--primary-dark);
                    margin-bottom: 8px;
                }

                .required {
                    color: #dc3545;
                }

                .form-control {
                    width: 100%;
                    padding: 12px 16px;
                    font-size: 0.95rem;
                    border: 1.5px solid var(--medium-gray);
                    border-radius: var(--radius-md);
                    outline: none;
                    transition: border-color 0.2s;
                    font-family: inherit;
                    color: var(--text-dark);
                }

                .form-control:focus {
                    border-color: var(--primary-color);
                }

                textarea.form-control {
                    resize: vertical;
                }

                .legal-agreement-box {
                    background: var(--light-gray);
                    padding: 20px;
                    border-radius: var(--radius-md);
                    margin-bottom: 25px;
                    border-left: 4px solid var(--primary-color);
                }

                .checkbox-container {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    cursor: pointer;
                }

                .checkbox-container input {
                    width: 18px;
                    height: 18px;
                    margin-top: 3px;
                    flex-shrink: 0;
                }

                .checkbox-text {
                    font-size: 0.85rem;
                    line-height: 1.5;
                    color: var(--text-dark);
                }

                .checkbox-text a {
                    color: var(--primary-color);
                    font-weight: 600;
                }

                .btn-pay-submit {
                    width: 100%;
                    padding: 16px;
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .btn-pay-submit:disabled {
                    background: var(--text-light);
                    cursor: not-allowed;
                    opacity: 0.6;
                    transform: none;
                    box-shadow: none;
                }

                @media (max-width: 992px) {
                    .booking-layout-grid {
                        grid-template-columns: 1fr;
                    }

                    .booking-info-sidebar {
                        padding: 30px;
                    }

                    .booking-interactive-card {
                        padding: 30px;
                    }
                }

                @media (max-width: 768px) {
                    .booking-page {
                        padding-top: 120px;
                    }
                    .booking-header h1 {
                        font-size: 2rem;
                    }
                    .form-row-grid {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingPage;
