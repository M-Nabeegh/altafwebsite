import React from 'react';
import { doctorProfile, clinicHours } from '../data/content';
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';

const BookingPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your request. Our team will contact you shortly to confirm your appointment.");
    };

    return (
        <div className="booking-page fade-in">
            <div className="container">
                <div className="booking-header text-center">
                    <h1>Book a Consultation</h1>
                    <p>Schedule an appointment with Prof. Dr. Javed Altaf for expert urological care.</p>
                </div>

                <div className="booking-grid">
                    {/* Contact Information & Schedule */}
                    <div className="info-card">
                        <h3>Clinic Information</h3>

                        <div className="info-item">
                            <FaMapMarkerAlt className="icon" />
                            <div>
                                <h4>Address</h4>
                                <p>{doctorProfile.address}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <FaPhone className="icon" />
                            <div>
                                <h4>Phone</h4>
                                <p>{doctorProfile.phone}</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <FaEnvelope className="icon" />
                            <div>
                                <h4>Email</h4>
                                <p>{doctorProfile.email}</p>
                            </div>
                        </div>

                        <div className="schedule-section">
                            <h4><FaClock style={{ marginRight: '10px' }} /> Clinic Hours</h4>
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

                    {/* Booking Form */}
                    <div className="form-card">
                        <h3>Request an Appointment</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Patient Name</label>
                                <input type="text" placeholder="Full Name" required />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" placeholder="0300-1234567" required />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input type="number" placeholder="Age" required />
                            </div>
                            <div className="form-group">
                                <label>Preferred Date</label>
                                <input type="date" required />
                            </div>
                            <div className="form-group">
                                <label>Message / Symptoms (Optional)</label>
                                <textarea rows="4" placeholder="Briefly describe your issue..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Submit Request</button>
                        </form>
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
                    grid-template-columns: 1fr 1fr;
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

                .schedule-section h4 {
                    color: var(--primary-dark);
                    margin: 30px 0 15px;
                    display: flex;
                    align-items: center;
                }

                .hours-list {
                    list-style: none;
                }

                .hours-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                    font-size: 0.95rem;
                    color: var(--text-dark);
                }

                .hours-item:last-child {
                    border-bottom: none;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: var(--text-dark);
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: var(--radius-md);
                    font-family: inherit;
                    transition: border-color 0.3s;
                }

                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--primary-color);
                    outline: none;
                }

                .btn-block {
                    width: 100%;
                    padding: 14px;
                    font-size: 1rem;
                }

                @media (max-width: 768px) {
                    .booking-grid {
                        grid-template-columns: 1fr;
                    }

                    .booking-page {
                        padding-top: 100px;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingPage;
