import React, { useState } from 'react';
import { doctorProfile } from '../data/content';
import { FaPhone, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaCreditCard, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookingPage = () => {
    const [agreed, setAgreed] = useState(false);

    const handleProceedToPayment = () => {
        if (agreed) {
            window.open('https://buy.stripe.com/test_eVq4gza9yfge8Tl3d45ZC00', '_blank');
        } else {
            alert("Please agree to the privacy policy to proceed.");
        }
    };

    return (
        <div className="booking-page fade-in">
            <div className="container">
                <div className="booking-header text-center">
                    <h1>Book an Online Consultation</h1>
                    <p>Secure your 20-minute consultation slot for personalized urological care.</p>
                </div>

                <div className="booking-card">
                    {/* Left Side: Info */}
                    <div className="booking-left">
                        <h3>Consultation Details</h3>

                        <div className="detail-item">
                            <FaCalendarAlt className="icon" />
                            <div>
                                <h5>Availability</h5>
                                <p>Sundays Only</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <FaClock className="icon" />
                            <div>
                                <h5>Time</h5>
                                <p>9:00 AM - 7:00 PM</p>
                                <span className="badge">20 Minute Slots</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <FaCreditCard className="icon" />
                            <div>
                                <h5>Fee</h5>
                                <p>PKR 5,000</p>
                            </div>
                        </div>

                        <div className="secure-note">
                            <p><FaLock className="lock-icon" /> Payments are securely processed via Stripe.</p>
                        </div>
                    </div>

                    {/* Right Side: Action */}
                    <div className="booking-right">
                        <h3>How It Works</h3>

                        <ol className="process-list">
                            <li><strong>Pre-Payment Information:</strong> Please note that online consultations are conducted on <strong>Sundays only</strong>.</li>
                            <li><strong>Secure Payment:</strong> Click the button below to pay the consultation fee via Stripe.</li>
                            <li><strong>Schedule:</strong> After payment, you will be automatically redirected to schedule your specific 20-minute time slot.</li>
                        </ol>

                        <div className="agreement-box">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => setAgreed(!agreed)}
                                />
                                <span>
                                    I adhere to the <Link to="/privacy-policy" target="_blank">Privacy Policy</Link> and understand that scheduling occurs after payment.
                                </span>
                            </label>
                        </div>

                        <button
                            className={`btn btn-primary btn-block ${!agreed ? 'disabled' : ''}`}
                            onClick={handleProceedToPayment}
                            disabled={!agreed}
                        >
                            Pay & Schedule Consultation
                        </button>

                        <p className="redirect-note">
                            *You will be redirected to Stripe for payment.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .booking-page {
                    padding: 160px 0 80px; /* Increased top padding for header */
                    background: var(--light-gray);
                    min-height: 90vh;
                }

                .booking-header {
                    margin-bottom: 50px;
                }

                .booking-header h1 {
                    color: var(--primary-dark);
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .booking-card {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .booking-left {
                    background: var(--primary-dark);
                    color: white;
                    padding: 50px;
                }

                .booking-left h3 {
                    color: white;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                    font-size: 1.5rem;
                }

                .detail-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .detail-item .icon {
                    font-size: 1.2rem;
                    color: var(--accent-color);
                    margin-top: 4px;
                }

                .detail-item h5 {
                    color: white;
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                }

                .detail-item p {
                    color: rgba(255,255,255,0.8);
                    font-size: 0.95rem;
                    margin: 0;
                }

                .badge {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    display: inline-block;
                    margin-top: 5px;
                }

                .secure-note {
                    margin-top: 60px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.2);
                }

                .secure-note p {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.6);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0;
                }

                .booking-right {
                    padding: 50px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .booking-right h3 {
                    color: var(--primary-dark);
                    margin-bottom: 30px;
                    font-size: 1.5rem;
                }

                .process-list {
                    margin-bottom: 40px;
                    counter-reset: item;
                    list-style: none;
                }

                .process-list li {
                    position: relative;
                    padding-left: 35px;
                    margin-bottom: 20px;
                    color: var(--text-dark);
                    line-height: 1.6;
                }

                .process-list li:before {
                    content: counter(item);
                    counter-increment: item;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 24px;
                    height: 24px;
                    background: var(--secondary-color);
                    color: var(--primary-color);
                    border-radius: 50%;
                    text-align: center;
                    line-height: 24px;
                    font-size: 0.85rem;
                    font-weight: 700;
                }

                .agreement-box {
                    background: var(--light-gray);
                    padding: 20px;
                    border-radius: var(--radius-md);
                    margin-bottom: 30px;
                }

                .checkbox-label {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    color: var(--text-dark);
                }

                .checkbox-label input {
                    margin-top: 4px;
                    width: 16px;
                    height: 16px;
                }

                .checkbox-label a {
                    color: var(--primary-color);
                    font-weight: 600;
                }

                .btn-block {
                    width: 100%;
                    padding: 16px;
                    font-size: 1.1rem;
                }

                .btn.disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    background: var(--text-light); /* Gray out disabled button */
                    color: white;
                }

                .redirect-note {
                    text-align: center;
                    font-size: 0.85rem;
                    color: var(--text-light);
                    margin-top: 15px;
                }

                @media (max-width: 900px) {
                    .booking-card {
                        grid-template-columns: 1fr;
                    }

                    .booking-left, .booking-right {
                        padding: 30px;
                    }
                    
                    .booking-page {
                        padding-top: 180px; /* Even more padding for mobile header */
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingPage;
