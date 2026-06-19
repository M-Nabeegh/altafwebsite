import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaEnvelope, FaVideo, FaFileMedical, FaCalendarAlt, FaClock, FaUser, FaCreditCard, FaShieldAlt, FaSyncAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

// Phase 1: Fast polling every 3s for first 60s
// Phase 2: Slow polling every 20s indefinitely until confirmed or manual close
const FAST_POLL_INTERVAL = 3000;
const SLOW_POLL_INTERVAL = 20000;
const FAST_POLL_COUNT    = 20; // 20 × 3s = 60s fast phase

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const [phase, setPhase]       = useState('fast');    // fast | slow
    const [uiState, setUiState]   = useState('verifying'); // verifying | confirmed | waiting
    const [apptData, setApptData] = useState(null);
    const [pollCount, setPollCount] = useState(0);
    const [lastChecked, setLastChecked] = useState(null);
    const [isManualChecking, setIsManualChecking] = useState(false);
    const intervalRef = useRef(null);

    const checkStatus = useCallback(async () => {
        if (!orderId) return false;
        try {
            const res = await fetch(`/api/payfast/status?orderId=${encodeURIComponent(orderId)}`);
            if (!res.ok) return false;
            const data = await res.json();
            setApptData(data);
            setLastChecked(new Date());
            if (data.status === 'confirmed' && data.paymentStatus === 'paid') {
                clearInterval(intervalRef.current);
                setUiState('confirmed');
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }, [orderId]);

    const handleManualCheck = async () => {
        setIsManualChecking(true);
        await checkStatus();
        setIsManualChecking(false);
    };

    useEffect(() => {
        if (!orderId) {
            setUiState('waiting');
            return;
        }

        let localCount = 0;
        let currentPhase = 'fast';

        const runPoll = async () => {
            const confirmed = await checkStatus();
            if (confirmed) return;

            localCount++;
            setPollCount(localCount);

            if (currentPhase === 'fast' && localCount >= FAST_POLL_COUNT) {
                // Switch to slow phase — keep polling every 20s indefinitely
                currentPhase = 'slow';
                setPhase('slow');
                setUiState('waiting');
                clearInterval(intervalRef.current);
                intervalRef.current = setInterval(runPoll, SLOW_POLL_INTERVAL);
            }
        };

        runPoll();
        intervalRef.current = setInterval(runPoll, FAST_POLL_INTERVAL);

        return () => clearInterval(intervalRef.current);
    }, [orderId, checkStatus]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-PK', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const fastProgress = Math.min((pollCount / FAST_POLL_COUNT) * 100, 98);

    return (
        <div className="pf-result-page fade-in">
            <SEO
                title="Payment Confirmed | Prof. Dr. Javed Altaf"
                description="Your appointment payment has been confirmed."
                url={`https://www.javedaltaf.com/payment-success/${orderId}`}
            />

            <div className="pf-result-container">

                {/* ── Fast Verifying ── */}
                {uiState === 'verifying' && (
                    <>
                        <div className="pf-icon pf-icon--spin">
                            <FaSpinner className="spin-icon" />
                        </div>
                        <h1 className="pf-title">Verifying Your Payment…</h1>
                        <p className="pf-subtitle">
                            Please wait while we confirm your payment with PayFast.
                        </p>
                        <div className="pf-progress-bar">
                            <div className="pf-progress-fill" style={{ width: `${fastProgress}%` }} />
                        </div>
                        <p className="pf-hint">Do not close this page.</p>
                    </>
                )}

                {/* ── Waiting (slow phase — IPN delayed) ── */}
                {uiState === 'waiting' && (
                    <>
                        <div className="pf-icon pf-icon--waiting">
                            <FaShieldAlt />
                        </div>
                        <h1 className="pf-title">Payment Received ✓</h1>
                        <div className="pf-received-badge">
                            <FaShieldAlt />
                            <span>PayFast confirmed your payment — finalizing appointment…</span>
                        </div>
                        <p className="pf-subtitle" style={{ marginTop: 16 }}>
                            Your payment was successfully processed by PayFast.
                            We are waiting for the final gateway notification to confirm your appointment.
                            <strong> This page will auto-update — you don't need to do anything.</strong>
                        </p>

                        {/* Auto-checking indicator */}
                        <div className="pf-auto-check">
                            <FaSpinner className="spin-icon-sm" />
                            <span>Checking automatically every 20 seconds…</span>
                            {lastChecked && (
                                <span className="pf-last-checked">
                                    Last checked: {lastChecked.toLocaleTimeString('en-PK')}
                                </span>
                            )}
                        </div>

                        {/* Manual check button */}
                        <button
                            className="pf-manual-check-btn"
                            onClick={handleManualCheck}
                            disabled={isManualChecking}
                        >
                            {isManualChecking ? (
                                <><FaSpinner className="spin-icon-sm" /> Checking…</>
                            ) : (
                                <><FaSyncAlt /> Check Now</>
                            )}
                        </button>

                        {/* Reference */}
                        {orderId && (
                            <div className="pf-basket-ref" style={{ marginTop: 20 }}>
                                Booking Reference: <code>{orderId}</code>
                            </div>
                        )}

                        {/* Email reassurance */}
                        <div className="pf-email-note">
                            <FaEnvelope />
                            <p>
                                Once confirmed, you will receive an email confirmation automatically.
                                If you paid via EasyPaisa or JazzCash wallet, confirmation may take up to 10 minutes.
                            </p>
                        </div>

                        <div className="pf-actions" style={{ marginTop: 24 }}>
                            <Link to="/" className="btn btn-outline">Return to Home</Link>
                        </div>
                    </>
                )}

                {/* ── Confirmed ── */}
                {uiState === 'confirmed' && (
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
                                            <span className="pf-sum-value pf-sum-paid">
                                                PKR {Number(apptData.amount).toLocaleString('en-PK')}
                                            </span>
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
                                    <p>A confirmation email with your booking details and a secure video link will arrive shortly.</p>
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
                    box-shadow: 0 0 0 12px rgba(22,163,74,0.08);
                }
                .pf-icon--spin {
                    background: #eff6ff;
                    color: var(--primary-color);
                }
                .pf-icon--waiting {
                    background: #fef9c3;
                    color: #ca8a04;
                    box-shadow: 0 0 0 12px rgba(202,138,4,0.08);
                }
                .spin-icon { animation: spin 1.2s linear infinite; }
                .spin-icon-sm { animation: spin 1.2s linear infinite; font-size: 0.85em; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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
                    max-width: 500px;
                    margin: 0 auto 28px;
                }
                /* Badges */
                .pf-success-badge, .pf-received-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 18px;
                    border-radius: 100px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .pf-success-badge {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    color: #15803d;
                }
                .pf-received-badge {
                    background: #fefce8;
                    border: 1px solid #fde047;
                    color: #854d0e;
                }
                /* Progress */
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
                .pf-hint { font-size: 0.8rem; color: var(--text-light); }
                /* Auto-check row */
                .pf-auto-check {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.82rem;
                    color: #ca8a04;
                    background: #fefce8;
                    border: 1px solid #fde047;
                    border-radius: var(--radius-sm);
                    padding: 10px 16px;
                    margin: 0 auto 16px;
                    max-width: 480px;
                    flex-wrap: wrap;
                }
                .pf-last-checked {
                    color: var(--text-light);
                    font-size: 0.78rem;
                    width: 100%;
                    margin-top: 2px;
                }
                /* Manual check button */
                .pf-manual-check-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: var(--radius-md);
                    padding: 11px 24px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 8px;
                }
                .pf-manual-check-btn:hover:not(:disabled) {
                    background: var(--primary-dark);
                    transform: translateY(-1px);
                }
                .pf-manual-check-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                /* Email note */
                .pf-email-note {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: var(--radius-md);
                    padding: 16px 20px;
                    text-align: left;
                    margin: 20px auto 0;
                    max-width: 500px;
                    font-size: 0.875rem;
                    color: #1e40af;
                    line-height: 1.5;
                }
                .pf-email-note svg { flex-shrink: 0; margin-top: 2px; font-size: 1rem; }
                .pf-email-note p { margin: 0; }
                /* Summary card */
                .pf-summary-card {
                    background: var(--secondary-color);
                    border: 1.5px solid rgba(0,86,179,0.15);
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
                    border-bottom: 1.5px solid rgba(0,86,179,0.1);
                }
                .pf-summary-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .pf-summary-item { display: flex; align-items: center; gap: 12px; }
                .pf-sum-icon { color: var(--primary-color); font-size: 1.2rem; flex-shrink: 0; }
                .pf-sum-label { display: block; font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
                .pf-sum-value { display: block; font-size: 0.95rem; font-weight: 700; color: var(--text-dark); }
                .pf-sum-paid { color: #16a34a !important; }
                .pf-basket-ref { font-size: 0.82rem; color: var(--text-light); padding-top: 14px; border-top: 1px solid rgba(0,86,179,0.1); }
                .pf-basket-ref code { font-size: 0.8rem; background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; margin-left: 6px; }
                /* Next steps */
                .pf-next-steps { text-align: left; margin-bottom: 32px; }
                .pf-next-steps h3 { font-size: 1.15rem; color: var(--primary-dark); margin-bottom: 20px; text-align: center; }
                .pf-step { display: flex; gap: 18px; align-items: flex-start; margin-bottom: 20px; }
                .pf-step-icon { width: 44px; height: 44px; background: var(--secondary-color); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
                .pf-step h5 { font-size: 0.95rem; color: var(--primary-dark); margin-bottom: 4px; }
                .pf-step p { font-size: 0.875rem; color: var(--text-light); line-height: 1.5; margin: 0; }
                .pf-home-btn { padding: 14px 36px; font-size: 1rem; }
                .pf-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
                .btn-outline { background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); padding: 12px 28px; border-radius: var(--radius-md); font-weight: 600; text-decoration: none; transition: all 0.2s; display: inline-block; }
                .btn-outline:hover { background: var(--primary-color); color: white; }
                @media (max-width: 640px) {
                    .pf-result-container { padding: 40px 24px; }
                    .pf-title { font-size: 1.5rem; }
                    .pf-summary-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess;
