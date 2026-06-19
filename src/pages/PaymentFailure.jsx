import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaPhone, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

const PaymentFailure = () => {
    const { orderId } = useParams();
    const [apptData, setApptData] = useState(null);

    useEffect(() => {
        if (!orderId) return;
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/payfast/status?orderId=${encodeURIComponent(orderId)}`);
                if (res.ok) {
                    const data = await res.json();
                    setApptData(data);
                }
            } catch {
                // Silent fail — failure page should still render
            }
        };
        fetchStatus();
    }, [orderId]);

    return (
        <div className="pf-fail-page fade-in">
            <SEO
                title="Payment Failed | Prof. Dr. Javed Altaf"
                description="Your payment was not completed. Please try again or contact support."
                url={`https://www.javedaltaf.com/payment-failure/${orderId}`}
            />

            <div className="pf-fail-container">

                {/* Icon */}
                <div className="pf-fail-icon">
                    <FaTimesCircle />
                </div>

                <h1 className="pf-fail-title">Payment Was Not Completed</h1>
                <p className="pf-fail-subtitle">
                    Your appointment has <strong>not</strong> been confirmed. No charge was made to your account.
                    You can try again or contact us for assistance.
                </p>

                {/* Reference */}
                {orderId && (
                    <div className="pf-fail-ref">
                        <FaShieldAlt style={{ marginRight: 6 }} />
                        Reference: <code>{orderId}</code>
                    </div>
                )}

                {/* Appointment info if we have it */}
                {apptData && (
                    <div className="pf-fail-appt">
                        <p>Your previously selected slot:</p>
                        <strong>
                            {apptData.slotDate ? new Date(apptData.slotDate).toLocaleDateString('en-PK', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            }) : '—'} — {apptData.slotTime}
                        </strong>
                        <p className="pf-fail-appt-note">
                            This slot may still be available. Please book again to reserve it.
                        </p>
                    </div>
                )}

                {/* Common Reasons */}
                <div className="pf-fail-reasons">
                    <h4>Common Reasons for Failure</h4>
                    <ul>
                        <li>Payment was cancelled on the gateway page</li>
                        <li>Card declined or insufficient funds</li>
                        <li>Bank OTP timeout</li>
                        <li>Session expired during payment</li>
                    </ul>
                </div>

                {/* CTA Buttons */}
                <div className="pf-fail-actions">
                    <Link to="/booking" className="btn btn-primary pf-retry-btn">
                        <FaRedo style={{ marginRight: 8 }} />
                        Try Again — Book New Slot
                    </Link>
                </div>

                {/* Support Contact */}
                <div className="pf-fail-support">
                    <p>Need help? Contact us:</p>
                    <div className="pf-fail-contacts">
                        <a href="mailto:info@javedaltaf.com" className="pf-contact-link">
                            <FaEnvelope />
                            <span>info@javedaltaf.com</span>
                        </a>
                        <a href="https://wa.me/923001234567" className="pf-contact-link pf-contact-wa" target="_blank" rel="noopener noreferrer">
                            <FaPhone />
                            <span>WhatsApp Support</span>
                        </a>
                    </div>
                </div>

            </div>

            <style>{`
                .pf-fail-page {
                    min-height: 100vh;
                    background: var(--light-gray);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 120px 20px 60px;
                }

                .pf-fail-container {
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    padding: 60px 50px;
                    max-width: 640px;
                    width: 100%;
                    text-align: center;
                }

                .pf-fail-icon {
                    font-size: 4.5rem;
                    color: #ef4444;
                    margin-bottom: 20px;
                    animation: fadeInDown 0.5s ease;
                }

                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .pf-fail-title {
                    font-size: 1.9rem;
                    color: var(--primary-dark);
                    margin-bottom: 14px;
                    line-height: 1.25;
                }

                .pf-fail-subtitle {
                    font-size: 0.95rem;
                    color: var(--text-light);
                    line-height: 1.6;
                    margin-bottom: 22px;
                    max-width: 440px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .pf-fail-ref {
                    display: inline-flex;
                    align-items: center;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #991b1b;
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 0.82rem;
                    margin-bottom: 28px;
                }

                .pf-fail-ref code {
                    font-family: monospace;
                    margin-left: 6px;
                    font-weight: 600;
                }

                .pf-fail-appt {
                    background: var(--secondary-color);
                    border: 1.5px solid rgba(0, 86, 179, 0.15);
                    border-radius: var(--radius-md);
                    padding: 20px 24px;
                    margin-bottom: 24px;
                    text-align: left;
                }

                .pf-fail-appt p {
                    font-size: 0.82rem;
                    color: var(--text-light);
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .pf-fail-appt strong {
                    display: block;
                    font-size: 0.95rem;
                    color: var(--primary-dark);
                    margin-bottom: 8px;
                }

                .pf-fail-appt-note {
                    font-size: 0.8rem !important;
                    color: var(--text-light) !important;
                    margin-bottom: 0 !important;
                    text-transform: none !important;
                    letter-spacing: 0 !important;
                }

                .pf-fail-reasons {
                    background: #fef9c3;
                    border: 1px solid #fde047;
                    border-radius: var(--radius-md);
                    padding: 20px 24px;
                    margin-bottom: 28px;
                    text-align: left;
                }

                .pf-fail-reasons h4 {
                    font-size: 0.9rem;
                    color: #78350f;
                    margin-bottom: 10px;
                }

                .pf-fail-reasons ul {
                    padding-left: 18px;
                }

                .pf-fail-reasons li {
                    font-size: 0.85rem;
                    color: #92400e;
                    margin-bottom: 6px;
                    line-height: 1.4;
                }

                .pf-fail-actions {
                    margin-bottom: 32px;
                }

                .pf-retry-btn {
                    padding: 14px 32px;
                    font-size: 1rem;
                    display: inline-flex;
                    align-items: center;
                    border-radius: var(--radius-md);
                }

                .pf-fail-support {
                    border-top: 1px solid var(--medium-gray);
                    padding-top: 24px;
                }

                .pf-fail-support p {
                    font-size: 0.85rem;
                    color: var(--text-light);
                    margin-bottom: 14px;
                }

                .pf-fail-contacts {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .pf-contact-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-decoration: none;
                    background: var(--secondary-color);
                    color: var(--primary-color);
                    border: 1.5px solid rgba(0, 86, 179, 0.2);
                    transition: all 0.2s;
                }

                .pf-contact-link:hover {
                    background: var(--primary-color);
                    color: white;
                }

                .pf-contact-wa {
                    background: #f0fdf4;
                    color: #16a34a;
                    border-color: #bbf7d0;
                }

                .pf-contact-wa:hover {
                    background: #16a34a;
                    color: white;
                }

                @media (max-width: 640px) {
                    .pf-fail-container {
                        padding: 40px 24px;
                    }
                    .pf-fail-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default PaymentFailure;
