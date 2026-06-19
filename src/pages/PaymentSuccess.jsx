import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaEnvelope, FaVideo, FaFileMedical, FaCalendarAlt, FaClock, FaUser, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

const MAX_POLLS   = 15;   // 15 × 3s = 45 seconds max wait
const POLL_DELAY  = 3000; // 3 seconds between polls

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const [status, setStatus]     = useState('verifying'); // verifying | confirmed | pending_review
    const [apptData, setApptData] = useState(null);
    const [pollCount, setPollCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!orderId) {
            setStatus('pending_review');
            return;
        }

        const poll = async () => {
            try {
                const res = await fetch(`/api/payfast/status?orderId=${encodeURIComponent(orderId)}`);
                if (!res.ok) {
                    setPollCount(c => c + 1);
                    return;
                }
                const data = await res.json();
                setApptData(data);

                if (data.status === 'confirmed' && data.paymentStatus === 'paid') {
                    clearInterval(intervalRef.current);
                    setStatus('confirmed');
                } else if (data.status === 'failed') {
                    clearInterval(intervalRef.current);
                    setStatus('pending_review');
                } else {
                    setPollCount(c => {
                        const next = c + 1;
                        if (next >= MAX_POLLS) {
                            clearInterval(intervalRef.current);
                            setStatus('pending_review');
                        }
                        return next;
                    });
                }
            } catch {
                setPollCount(c => c + 1);
            }
        };

        poll(); // initial call immediately
        intervalRef.current = setInterval(poll, POLL_DELAY);

        return () => clearInterval(intervalRef.current);
    }, [orderId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-PK', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="pf-result-page fade-in">
            <SEO
                title="Payment Confirmed | Prof. Dr. Javed Altaf"
                description="Your appointment payment has been confirmed. See your consultation details."
                url={`https://www.javedaltaf.com/payment-success/${orderId}`}
            />

            <div className="pf-result-container">

                {/* ── Verifying State ── */}
                {status === 'verifying' && (
                    <>
                        <div className="pf-icon pf-icon--spin">
                            <FaSpinner className="spin-icon" />
                        </div>
                        <h1 className="pf-title">Verifying Your Payment…</h1>
                        <p className="pf-subtitle">
                            Please wait while we confirm your payment with our gateway.
                            This usually takes a few seconds.
                        </p>
                        <div className="pf-progress-bar">
                            <div
                                className="pf-progress-fill"
                                style={{ width: `${Math.min((pollCount / MAX_POLLS) * 100, 95)}%` }}
                            />
                        </div>
                        <p className="pf-hint">Do not close this page.</p>
                    </>
                )}

                {/* ── Confirmed State ── */}
                {status === 'confirmed' && (
                    <>
                        <div className="pf-icon pf-icon--success">
                            <FaCheckCircle />
                        </div>
                        <h1 className="pf-title">Consultation Confirmed! 🎉</h1>
                        <div className="pf-success-badge">
                            <FaShieldAlt />
                            <span>Payment verified &amp; secured via PayFast</span>
                        </div>

                        {apptData && (
                            <div className="pf-summary-card">
                                <h3 className="pf-summary-title">Appointment Summary</h3>
                                <div className="pf-summary-grid">
                                    <div className="pf-summary-item">
                                        <FaUser className="pf-sum-icon" />
                                        <div>
                                            <span className="pf-sum-label">Patient</span>
                                            <span className="pf-sum-value">{apptData.patientName}</span>
                                        </div>
                                    </div>
                                    <div className="pf-summary-item">
                                        <FaCalendarAlt className="pf-sum-icon" />
                                        <div>
                                            <span className="pf-sum-label">Date</span>
                                            <span className="pf-sum-value">{formatDate(apptData.slotDate)}</span>
                                        </div>
                                    </div>
                                    <div className="pf-summary-item">
                                        <FaClock className="pf-sum-icon" />
                                        <div>
                                            <span className="pf-sum-label">Time Slot</span>
                                            <span className="pf-sum-value">{apptData.slotTime}</span>
                                        </div>
                                    </div>
                                    <div className="pf-summary-item">
                                        <FaCreditCard className="pf-sum-icon" />
                                        <div>
                                            <span className="pf-sum-label">Amount Paid</span>
                                            <span className="pf-sum-value pf-sum-paid">PKR {Number(apptData.amount).toLocaleString('en-PK')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pf-basket-ref">
                                    Booking Reference: <code>{apptData.basketId}</code>
                                </div>
                            </div>
                        )}

                        <div className="pf-next-steps">
                            <h3>What Happens Next?</h3>
                            <div className="pf-step">
                                <div className="pf-step-icon"><FaEnvelope /></div>
                                <div>
                                    <h5>Check Your Email</h5>
                                    <p>A confirmation email with your booking details has been sent. You will also receive a secure video link before your appointment.</p>
                                </div>
                            </div>
                            <div className="pf-step">
                                <div className="pf-step-icon"><FaVideo /></div>
                                <div>
                                    <h5>Join on Time</h5>
                                    <p>Be ready at your selected slot on Saturday. The consultation is 20 minutes with Prof. Dr. Javed Altaf.</p>
                                </div>
                            </div>
                            <div className="pf-step">
                                <div className="pf-step-icon"><FaFileMedical /></div>
                                <div>
                                    <h5>Prepare Your Reports</h5>
                                    <p>Keep any lab reports, ultrasounds, or prescriptions ready for review during the consultation.</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/" className="btn btn-primary pf-home-btn">Return to Home</Link>
                    </>
                )}

                {/* ── Pending Review (timeout / edge case) ── */}
                {status === 'pending_review' && (
                    <>
                        <div className="pf-icon pf-icon--pending">
                            <FaShieldAlt />
                        </div>
                        <h1 className="pf-title">Payment Processing…</h1>
                        <p className="pf-subtitle">
                            Your payment appears to have been submitted. Our system is still waiting for confirmation from the gateway. This is normal and may take up to a few minutes.
                        </p>
                        <div className="pf-info-box">
                            <p><strong>What to do:</strong></p>
                            <ul>
                                <li>Check your email for a confirmation within 5 minutes.</li>
                                <li>If you don't receive one, contact us with your booking reference:</li>
                                <li><code className="pf-ref-code">{orderId}</code></li>
                            </ul>
                        </div>
                        <div className="pf-actions">
                            <Link to="/" className="btn btn-primary">Return to Home</Link>
                            <Link to="/booking" className="btn btn-outline">Book Again</Link>
                        </div>
                    </>
                )}

            </div>

            <style>{`
                .pf-result-page {
                    min-height: 100vh;
                    background: var(--light-gray);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 120px 20px 60px;
                }

                .pf-result-container {
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    padding: 60px 50px;
                    max-width: 720px;
                    width: 100%;
                    text-align: center;
                }

                /* ── Icons ── */
                .pf-icon {
                    margin: 0 auto 24px;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.4rem;
                }

                .pf-icon--success {
                    background: #dcfce7;
                    color: #16a34a;
                    box-shadow: 0 0 0 12px rgba(22, 163, 74, 0.08);
                }

                .pf-icon--spin {
                    background: #eff6ff;
                    color: var(--primary-color);
                }

                .pf-icon--pending {
                    background: #fef9c3;
                    color: #ca8a04;
                }

                .spin-icon {
                    animation: spin 1.2s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                /* ── Typography ── */
                .pf-title {
                    font-size: 2rem;
                    color: var(--primary-dark);
                    margin-bottom: 14px;
                    line-height: 1.25;
                }

                .pf-subtitle {
                    font-size: 1rem;
                    color: var(--text-light);
                    line-height: 1.6;
                    max-width: 480px;
                    margin: 0 auto 28px;
                }

                /* ── Success Badge ── */
                .pf-success-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                    padding: 8px 18px;
                    border-radius: 100px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 32px;
                }

                /* ── Progress Bar ── */
                .pf-progress-bar {
                    background: #e5e7eb;
                    border-radius: 100px;
                    height: 6px;
                    max-width: 360px;
                    margin: 0 auto 16px;
                    overflow: hidden;
                }

                .pf-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--primary-color), #3b82f6);
                    border-radius: 100px;
                    transition: width 0.8s ease;
                }

                .pf-hint {
                    font-size: 0.8rem;
                    color: var(--text-light);
                }

                /* ── Summary Card ── */
                .pf-summary-card {
                    background: var(--secondary-color);
                    border: 1.5px solid rgba(0, 86, 179, 0.15);
                    border-radius: var(--radius-md);
                    padding: 28px;
                    text-align: left;
                    margin: 0 0 32px;
                }

                .pf-summary-title {
                    font-size: 1.1rem;
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1.5px solid rgba(0, 86, 179, 0.1);
                }

                .pf-summary-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .pf-summary-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .pf-sum-icon {
                    color: var(--primary-color);
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .pf-sum-label {
                    display: block;
                    font-size: 0.75rem;
                    color: var(--text-light);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 2px;
                }

                .pf-sum-value {
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--text-dark);
                }

                .pf-sum-paid {
                    color: #16a34a !important;
                }

                .pf-basket-ref {
                    font-size: 0.82rem;
                    color: var(--text-light);
                    padding-top: 14px;
                    border-top: 1px solid rgba(0, 86, 179, 0.1);
                }

                .pf-basket-ref code {
                    font-size: 0.8rem;
                    background: #dbeafe;
                    color: #1d4ed8;
                    padding: 2px 8px;
                    border-radius: 4px;
                    margin-left: 6px;
                }

                /* ── Next Steps ── */
                .pf-next-steps {
                    text-align: left;
                    margin-bottom: 32px;
                }

                .pf-next-steps h3 {
                    font-size: 1.15rem;
                    color: var(--primary-dark);
                    margin-bottom: 20px;
                    text-align: center;
                }

                .pf-step {
                    display: flex;
                    gap: 18px;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }

                .pf-step-icon {
                    width: 44px;
                    height: 44px;
                    background: var(--secondary-color);
                    color: var(--primary-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    flex-shrink: 0;
                }

                .pf-step h5 {
                    font-size: 0.95rem;
                    color: var(--primary-dark);
                    margin-bottom: 4px;
                }

                .pf-step p {
                    font-size: 0.875rem;
                    color: var(--text-light);
                    line-height: 1.5;
                    margin: 0;
                }

                /* ── Info Box (pending review) ── */
                .pf-info-box {
                    background: #fefce8;
                    border: 1.5px solid #fde047;
                    border-radius: var(--radius-md);
                    padding: 24px;
                    text-align: left;
                    margin-bottom: 28px;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    color: var(--text-dark);
                }

                .pf-info-box ul {
                    margin-top: 10px;
                    padding-left: 20px;
                }

                .pf-info-box li {
                    margin-bottom: 6px;
                }

                .pf-ref-code {
                    background: #fde68a;
                    color: #78350f;
                    padding: 3px 10px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.85rem;
                }

                /* ── Buttons ── */
                .pf-home-btn {
                    padding: 14px 36px;
                    font-size: 1rem;
                }

                .pf-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-outline {
                    background: transparent;
                    border: 2px solid var(--primary-color);
                    color: var(--primary-color);
                    padding: 12px 28px;
                    border-radius: var(--radius-md);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    display: inline-block;
                }

                .btn-outline:hover {
                    background: var(--primary-color);
                    color: white;
                }

                @media (max-width: 640px) {
                    .pf-result-container {
                        padding: 40px 24px;
                    }
                    .pf-title {
                        font-size: 1.5rem;
                    }
                    .pf-summary-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess;
