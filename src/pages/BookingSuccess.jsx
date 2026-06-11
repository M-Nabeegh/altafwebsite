import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaEnvelope, FaVideo, FaFileMedical, FaUser, FaCalendarAlt, FaClock, FaCreditCard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const BookingSuccess = () => {
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('pending_booking');
        if (storedData) {
            try {
                setBooking(JSON.parse(storedData));
            } catch (err) {
                console.error("Failed to parse pending booking from localStorage", err);
            }
        }
    }, []);

    return (
        <div className="success-page section fade-in">
            <SEO 
                title="Consultation Confirmed | Prof. Dr. Javed Altaf" 
                description="Your online consultation appointment has been successfully scheduled and payment received." 
                keywords="booking confirmed, Dr Javed Altaf success"
                url="https://www.javedaltaf.com/thank-you"
            />
            <div className="container text-center" style={{ maxWidth: '850px' }}>
                <div className="success-icon mb-4">
                    <FaCheckCircle />
                </div>

                <h1 className="display-4 font-weight-bold mb-4">Thank You — Your Online Consultation Is Confirmed</h1>

                <div className="confirmation-box mb-5">
                    <p className="lead mb-2">We have received your payment of <strong>PKR 4,000</strong>.</p>
                    <p className="text-muted">Your online consultation booking has been processed successfully.</p>
                </div>

                {booking && (
                    <div className="booking-summary-card mb-5">
                        <h3 className="summary-title">Appointment Summary</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <FaUser className="summary-icon" />
                                <div className="summary-details">
                                    <span className="summary-label">Patient Name</span>
                                    <span className="summary-value">{booking.patientName}</span>
                                </div>
                            </div>
                            <div className="summary-item">
                                <FaCalendarAlt className="summary-icon" />
                                <div className="summary-details">
                                    <span className="summary-label">Scheduled Date</span>
                                    <span className="summary-value">{booking.selectedDate}</span>
                                </div>
                            </div>
                            <div className="summary-item">
                                <FaClock className="summary-icon" />
                                <div className="summary-details">
                                    <span className="summary-label">Time Slot</span>
                                    <span className="summary-value">{booking.selectedTimeSlot}</span>
                                </div>
                            </div>
                            <div className="summary-item">
                                <FaCreditCard className="summary-icon" />
                                <div className="summary-details">
                                    <span className="summary-label">Consultation Fee</span>
                                    <span className="summary-value">{booking.fee || 'PKR 4,000'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="next-steps-section text-left mb-5">
                    <h3 className="mb-4 text-center">What Happens Next?</h3>

                    <div className="step-item">
                        <div className="icon-box"><FaEnvelope /></div>
                        <div>
                            <h5>Check Your Email</h5>
                            <p>You will receive a confirmation email containing your patient dashboard link and the <strong>secure video consultation link</strong>.</p>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="icon-box"><FaVideo /></div>
                        <div>
                            <h5>Join on Time</h5>
                            <p>Please be ready to join the video call at your selected slot on <strong>Saturday</strong>. Use the link provided in your email.</p>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="icon-box"><FaFileMedical /></div>
                        <div>
                            <h5>Prepare Your Reports</h5>
                            <p>Please keep your previous laboratory reports, ultrasounds, prescriptions, or any other relevant documents handy to review during the consultation.</p>
                        </div>
                    </div>
                </div>

                <Link to="/" className="btn btn-primary btn-lg">Return to Home</Link>
            </div>

            <style jsx>{`
                .success-page {
                    padding: 160px 0 100px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--light-gray);
                }
                
                .container {
                    width: 100%;
                    max-width: 850px;
                    background: white;
                    padding: 60px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                }

                .success-icon {
                    font-size: 4.5rem;
                    color: #10b981;
                    margin-bottom: 1.5rem;
                }

                h1 {
                    font-size: 2.4rem;
                    color: var(--primary-dark);
                    margin-bottom: 1.5rem;
                    line-height: 1.25;
                }

                .confirmation-box {
                    background: #f0fdf4;
                    padding: 22px;
                    border-radius: var(--radius-md);
                    border: 1px solid #bbf7d0;
                    color: #166534;
                }

                .confirmation-box .lead {
                    font-size: 1.15rem;
                    font-weight: 500;
                    margin-bottom: 4px;
                }

                .confirmation-box .text-muted {
                    color: #15803d !important;
                    font-size: 0.9rem;
                    opacity: 0.85;
                }

                /* Summary Card */
                .booking-summary-card {
                    background: var(--secondary-color);
                    border: 1.5px solid rgba(0, 86, 179, 0.15);
                    border-radius: var(--radius-md);
                    padding: 30px;
                    text-align: left;
                }

                .summary-title {
                    font-size: 1.2rem;
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                    border-bottom: 1.5px solid rgba(0, 86, 179, 0.1);
                    padding-bottom: 10px;
                }

                .summary-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .summary-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .summary-icon {
                    color: var(--primary-color);
                    font-size: 1.3rem;
                    flex-shrink: 0;
                }

                .summary-details {
                    display: flex;
                    flex-direction: column;
                }

                .summary-label {
                    font-size: 0.8rem;
                    color: var(--text-light);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .summary-value {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-dark);
                    margin-top: 2px;
                }

                .next-steps-section {
                    text-align: left;
                    margin: 0 auto 3rem;
                    max-width: 650px;
                }

                .next-steps-section h3 {
                    color: var(--primary-dark);
                    font-size: 1.4rem;
                }

                .step-item {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 25px;
                    align-items: flex-start;
                }

                .step-item .icon-box {
                    width: 48px;
                    height: 48px;
                    background: var(--secondary-color);
                    color: var(--primary-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    flex-shrink: 0;
                }

                .step-item h5 {
                    color: var(--primary-dark);
                    font-size: 1.05rem;
                    margin-bottom: 4px;
                }

                .step-item p {
                    color: var(--text-light);
                    font-size: 0.9rem;
                    line-height: 1.5;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .success-page {
                        padding: 120px 20px 60px;
                    }
                    .container {
                        padding: 40px 20px;
                    }
                    h1 {
                        font-size: 1.8rem;
                    }
                    .summary-grid {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingSuccess;
