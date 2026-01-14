import React from 'react';
import { FaCheckCircle, FaEnvelope, FaVideo, FaFileMedical } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BookingSuccess = () => {
    return (
        <div className="success-page section fade-in">
            <div className="container text-center" style={{ maxWidth: '800px' }}>
                <div className="success-icon mb-4">
                    <FaCheckCircle />
                </div>

                <h1 className="display-4 font-weight-bold mb-4">Thank You — Your Online Consultation Is Confirmed</h1>

                <div className="confirmation-box mb-5">
                    <p className="lead mb-2">We have received your payment of <strong>PKR 5,000</strong>.</p>
                    <p className="text-muted">Your online consultation has been successfully booked.</p>
                </div>

                <div className="next-steps-section text-left mb-5">
                    <h3 className="mb-4 text-center">What Happens Next?</h3>

                    <div className="step-item">
                        <div className="icon-box"><FaEnvelope /></div>
                        <div>
                            <h5>Check Your Email</h5>
                            <p>You will receive a confirmation email containing the <strong>secure video consultation link</strong>.</p>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="icon-box"><FaVideo /></div>
                        <div>
                            <h5>Join on Time</h5>
                            <p>Please be available and ready to join the call at your selected time on Sunday.</p>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="icon-box"><FaFileMedical /></div>
                        <div>
                            <h5>Prepare Your Reports</h5>
                            <p>Keep any relevant medical reports or history ready for review during the session.</p>
                        </div>
                    </div>
                </div>

                <Link to="/" className="btn btn-primary btn-lg">Return to Home</Link>
            </div>

            <style jsx>{`
                .success-page {
                    padding: 120px 0;
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                }
                
                .success-icon {
                    font-size: 5rem;
                    color: #2e7d32; /* Success Green */
                }

                .confirmation-box {
                    background: #f0fdf4;
                    padding: 30px;
                    border-radius: var(--radius-lg);
                    border: 1px solid #bbf7d0;
                }

                .next-steps-section {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }

                .step-item {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .step-item:last-child {
                    margin-bottom: 0;
                }

                .icon-box {
                    background: var(--light-gray);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .step-item h5 {
                    color: var(--primary-dark);
                    margin-bottom: 8px;
                    font-weight: 700;
                }

                .step-item p {
                    color: var(--text-light);
                    margin: 0;
                }

                @media (max-width: 600px) {
                    .success-page {
                        padding-top: 100px;
                    }
                    .step-item {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    .icon-box {
                        margin: 0 auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingSuccess;
