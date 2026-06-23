import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    FaExclamationTriangle, FaRedo, FaPhone, FaEnvelope, FaShieldAlt,
    FaSpinner, FaSyncAlt, FaSms
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { doctorProfile } from '../data/content';
import {
    hasDetectedPaidAppointment,
    hasTerminalFailedPayment,
} from '../utils/paymentStatus';

const POLL_INTERVAL = 5000;
const BACKGROUND_POLL_INTERVAL = 30000;
const MAX_ACTIVE_VERIFICATION_TIME = 10 * 60 * 1000;

const PaymentFailure = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [apptData, setApptData] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);
    const [manualChecking, setManualChecking] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);
    const [verificationExpired, setVerificationExpired] = useState(false);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const fetchStatus = useCallback(async () => {
        if (!orderId) return;
        try {
            const res = await fetch(`/api/payfast/status?orderId=${encodeURIComponent(orderId)}`);
            setLastChecked(new Date());
            if (!res.ok) return;

            const data = await res.json();
            setApptData(data);

            if (hasDetectedPaidAppointment(data)) {
                clearInterval(intervalRef.current);
                clearTimeout(timeoutRef.current);
                navigate(`/payment-success/${encodeURIComponent(orderId)}`, { replace: true });
                return;
            }

            if (hasTerminalFailedPayment(data)) {
                clearInterval(intervalRef.current);
                clearTimeout(timeoutRef.current);
                setPaymentFailed(true);
            }
        } catch {
            // Keep the page usable and retry on the next polling interval.
        }
    }, [navigate, orderId]);

    const handleManualRefresh = async () => {
        setManualChecking(true);
        await fetchStatus();
        setManualChecking(false);
    };

    useEffect(() => {
        if (!orderId) return;
        const initialCheck = setTimeout(fetchStatus, 0);
        intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL);
        timeoutRef.current = setTimeout(() => {
            setVerificationExpired(true);
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(fetchStatus, BACKGROUND_POLL_INTERVAL);
        }, MAX_ACTIVE_VERIFICATION_TIME);
        return () => {
            clearTimeout(initialCheck);
            clearTimeout(timeoutRef.current);
            clearInterval(intervalRef.current);
        };
    }, [fetchStatus, orderId]);

    const activelyVerifying = !paymentFailed && !verificationExpired;

    return (
        <div className="pf-fail-page fade-in">
            <SEO
                title="Payment Status Pending | Prof. Dr. Javed Altaf"
                description="Your payment result is being checked and delayed confirmations are updated automatically."
                url={`https://www.javedaltaf.com/payment-failure/${orderId}`}
            />

            <div className="pf-fail-container">

                {/* Icon */}
                <div className="pf-fail-icon">
                    <FaExclamationTriangle />
                </div>

                <h1 className="pf-fail-title">
                    {paymentFailed
                        ? 'Payment Was Not Completed'
                        : verificationExpired
                            ? 'Payment Could Not Be Confirmed'
                            : 'Checking Your Payment Status'}
                </h1>
                <p className="pf-fail-subtitle">
                    {paymentFailed
                        ? 'The payment service reported that this transaction was unsuccessful. Your appointment has not been confirmed.'
                        : verificationExpired
                            ? 'We could not confirm this payment within 10 minutes. Please check your bank or wallet before trying again.'
                            : 'We have not received a final result yet. Bank and wallet confirmations can sometimes take a few minutes.'}
                </p>

                {activelyVerifying ? (
                    <div className="pf-verification-note" role="status" aria-live="polite">
                        <FaSpinner className="spin-icon" />
                        <div>
                            <strong>Checking automatically</strong>
                            <p>
                                If payment is detected, this page will update automatically and you will receive
                                confirmation by <FaEnvelope aria-hidden="true" /> email and <FaSms aria-hidden="true" /> SMS.
                            </p>
                            <button
                                type="button"
                                className="pf-check-now"
                                onClick={handleManualRefresh}
                                disabled={manualChecking}
                            >
                                <FaSyncAlt className={manualChecking ? 'spin-icon' : ''} />
                                {manualChecking ? 'Checking…' : 'Check Now'}
                            </button>
                            {lastChecked && (
                                <span className="pf-last-checked">
                                    Last checked {lastChecked.toLocaleTimeString('en-PK', {
                                        hour: '2-digit', minute: '2-digit', second: '2-digit'
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="pf-final-status-note" role="status">
                        <strong>{paymentFailed ? 'Payment unsuccessful' : 'Automatic verification ended'}</strong>
                        <p>
                            {paymentFailed
                                ? 'If your bank or wallet shows a debit, contact the clinic with your booking reference before paying again.'
                                : 'We will still check quietly for a late confirmation. If payment is later detected, you will receive email and SMS confirmation.'}
                        </p>
                        <button
                            type="button"
                            className="pf-check-now"
                            onClick={handleManualRefresh}
                            disabled={manualChecking}
                        >
                            <FaSyncAlt className={manualChecking ? 'spin-icon' : ''} />
                            {manualChecking ? 'Checking…' : 'Check Again'}
                        </button>
                    </div>
                )}

                {!paymentFailed && (
                    <div className="pf-duplicate-warning">
                        <strong>Please do not make a second payment immediately.</strong>
                        Wait for the confirmation email/SMS or check your bank or wallet first.
                    </div>
                )}

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
                            {activelyVerifying
                                ? 'We are checking this booking reference automatically.'
                                : 'This slot is not confirmed unless you receive email or SMS confirmation.'}
                        </p>
                    </div>
                )}

                {/* Common Reasons */}
                {!activelyVerifying && (
                    <div className="pf-fail-reasons">
                        <h4>Common Reasons for Failure</h4>
                        <ul>
                            <li>Payment was cancelled before completion</li>
                            <li>Card declined or insufficient funds</li>
                            <li>Bank OTP timeout</li>
                            <li>Payment session expired</li>
                        </ul>
                    </div>
                )}

                {/* CTA Buttons */}
                {!activelyVerifying && (
                    <div className="pf-fail-actions">
                        <Link to="/booking" className="btn btn-primary pf-retry-btn">
                            <FaRedo style={{ marginRight: 8 }} />
                            Try Payment Again
                        </Link>
                    </div>
                )}

                {/* Support Contact */}
                <div className="pf-fail-support">
                    <p>Need help? Contact us:</p>
                    <div className="pf-fail-contacts">
                        <a href="mailto:contact@javedaltaf.com" className="pf-contact-link">
                            <FaEnvelope />
                            <span>contact@javedaltaf.com</span>
                        </a>
                        <a href={doctorProfile.supportWhatsAppLink} className="pf-contact-link pf-contact-wa" target="_blank" rel="noopener noreferrer">
                            <FaPhone />
                            <span>{doctorProfile.supportPhone}</span>
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
                    color: #d97706;
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

                .spin-icon { animation: spin 1.2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .pf-verification-note {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    color: #1e40af;
                    padding: 18px 20px;
                    border-radius: var(--radius-md);
                    text-align: left;
                    margin-bottom: 16px;
                }

                .pf-verification-note > svg {
                    flex: 0 0 auto;
                    margin-top: 3px;
                    font-size: 1.1rem;
                }

                .pf-final-status-note {
                    background: #fff7ed;
                    border: 1px solid #fed7aa;
                    color: #9a3412;
                    padding: 18px 20px;
                    border-radius: var(--radius-md);
                    text-align: left;
                    margin-bottom: 16px;
                }

                .pf-final-status-note strong { display: block; margin-bottom: 5px; }
                .pf-final-status-note p {
                    margin: 0 0 10px;
                    font-size: 0.85rem;
                    line-height: 1.55;
                }

                .pf-verification-note strong { display: block; margin-bottom: 5px; }
                .pf-verification-note p {
                    margin: 0 0 10px;
                    font-size: 0.85rem;
                    line-height: 1.55;
                }
                .pf-verification-note p svg { vertical-align: -1px; margin: 0 2px; }

                .pf-check-now {
                    border: 0;
                    background: transparent;
                    color: var(--primary-color);
                    font-weight: 700;
                    cursor: pointer;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.82rem;
                }

                .pf-check-now:disabled { cursor: wait; opacity: 0.65; }
                .pf-last-checked {
                    display: inline-block;
                    margin-left: 12px;
                    font-size: 0.73rem;
                    color: #64748b;
                }

                .pf-duplicate-warning {
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    color: #92400e;
                    border-radius: var(--radius-md);
                    padding: 13px 16px;
                    margin-bottom: 22px;
                    font-size: 0.83rem;
                    line-height: 1.5;
                }

                .pf-duplicate-warning strong { display: block; }

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
