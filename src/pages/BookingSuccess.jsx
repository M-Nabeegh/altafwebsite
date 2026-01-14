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
                    padding: 80px 0 100px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--light-gray);
                }
                
                .container {
                    width: 100%;
                    max-width: 800px;
                    background: white;
                    padding: 60px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }

                .success-icon {
                    font-size: 4rem;
                    color: var(--primary-color);
                    margin-bottom: 2rem;
                }

                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                }

                .confirmation-box {
                    background: #f0fdf4;
                    padding: 25px;
                    border-radius: var(--radius-md);
                    border: 1px solid #bbf7d0;
                    margin-bottom: 3rem;
                }

                .next-steps-section {
                    text-align: left;
                    margin: 0 auto 3rem;
                    max-width: 600px;
                }

                .step-item {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 25px;
                    align-items: flex-start;
                }

                @media (max-width: 768px) {
                    .success-page {
                        padding: 120px 20px 60px;
                    }
                    .container {
                        padding: 40px 20px;
                    }
                    h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default BookingSuccess;
