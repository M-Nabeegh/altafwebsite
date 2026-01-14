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

                <div className="booking-container bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="row no-gutters">
                        {/* Left Side: Info */}
                        <div className="col-md-5 bg-primary-dark text-white p-5">
                            <h3 className="text-white mb-4">Consultation Details</h3>

                            <div className="detail-item mb-4">
                                <FaCalendarAlt className="icon mb-2" style={{ opacity: 0.8 }} />
                                <h5>Availability</h5>
                                <p className="text-white-50">Sundays Only</p>
                            </div>

                            <div className="detail-item mb-4">
                                <FaClock className="icon mb-2" style={{ opacity: 0.8 }} />
                                <h5>Time</h5>
                                <p className="text-white-50">9:00 AM - 7:00 PM</p>
                                <p className="text-white-50 badge badge-light text-dark mt-1">20 Minute Slots</p>
                            </div>

                            <div className="detail-item mb-4">
                                <FaCreditCard className="icon mb-2" style={{ opacity: 0.8 }} />
                                <h5>Fee</h5>
                                <p className="text-white-50">PKR 5,000</p>
                            </div>

                            <div className="mt-5">
                                <p className="small text-white-50">
                                    <FaLock className="mr-1" /> Payments are securely processed via Stripe.
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Action */}
                        <div className="col-md-7 p-5 d-flex flex-column justify-content-center">
                            <h3 className="mb-4 text-dark">How It Works</h3>

                            <ol className="process-list mb-5">
                                <li><strong>Pre-Payment Information:</strong> Please note that consultations are only conducted on Sundays.</li>
                                <li><strong>Secure Payment:</strong> Click the button below to pay the consultation fee via Stripe.</li>
                                <li><strong>Schedule:</strong> After payment, you will be redirected to schedule your specific time slot.</li>
                            </ol>

                            <div className="agreement-box mb-4">
                                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={() => setAgreed(!agreed)}
                                        className="mr-2"
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <span className="text-muted ml-2">
                                        I adhere to the <Link to="/privacy-policy" target="_blank" className="text-primary">Privacy Policy</Link> and understand that scheduling occurs after payment.
                                    </span>
                                </label>
                            </div>

                            <button
                                className={`btn btn-primary btn-lg btn-block ${!agreed ? 'disabled' : ''}`}
                                onClick={handleProceedToPayment}
                                disabled={!agreed}
                                style={{ opacity: agreed ? 1 : 0.6, cursor: agreed ? 'pointer' : 'not-allowed' }}
                            >
                                Pay & Schedule Consultation
                            </button>

                            <p className="text-muted text-center mt-3 small">
                                *You will be redirected to Stripe for payment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .booking-page {
                    padding: 120px 0 80px;
                    background: var(--light-gray);
                    min-height: 90vh;
                }

                .bg-primary-dark {
                    background-color: var(--primary-dark);
                }

                .process-list {
                    padding-left: 20px;
                    color: var(--text-dark);
                }

                .process-list li {
                    margin-bottom: 15px;
                    line-height: 1.6;
                }

                .detail-item h5 {
                    font-weight: 600;
                    margin-bottom: 5px;
                }

                @media (max-width: 768px) {
                    .booking-page {
                        padding-top: 100px;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingPage;
