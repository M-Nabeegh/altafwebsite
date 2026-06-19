import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FaCheckCircle, FaSpinner, FaEnvelope, FaVideo, FaFileMedical,
    FaCalendarAlt, FaClock, FaUser, FaCreditCard, FaShieldAlt, FaSyncAlt
} from 'react-icons/fa';
import SEO from '../components/SEO';

// PayFast only ever redirects to SUCCESS_URL if payment succeeded on their end.
// So we show "Confirmed" IMMEDIATELY on page load for good UX.
// We then poll quietly in background to fetch appointment details from our DB
// (which gets confirmed once the IPN arrives — could take seconds or minutes).

const POLL_INTERVAL = 5000; // poll every 5s for appointment details

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const [apptData, setApptData]   = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [lastChecked, setLastChecked] = useState(null);
    const [manualChecking, setManualChecking] = useState(false);
    const intervalRef = useRef(null);

    const fetchDetails = useCallback(async () => {
        if (!orderId) return;
        try {
            const res = await fetch(`/api/payfast/status?orderId=${encodeURIComponent(orderId)}`);
            if (!res.ok) return;
            const data = await res.json();
            setLastChecked(new Date());
            if (data && data.patientName) {
                setApptData(data);
                setLoadingDetails(false);
                // If appointment is confirmed in DB, no need to keep polling
                if (data.status === 'confirmed') {
                    clearInterval(intervalRef.current);
                }
            }
        } catch { /* silent */ }
    }, [orderId]);

    const handleManualRefresh = async () => {
        setManualChecking(true);
        await fetchDetails();
        setManualChecking(false);
    };

    useEffect(() => {
        if (!orderId) { setLoadingDetails(false); return; }
        fetchDetails();
        intervalRef.current = setInterval(fetchDetails, POLL_INTERVAL);
        return () => clearInterval(intervalRef.current);
    }, [orderId, fetchDetails]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-PK', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="pf-result-page fade-in">
            <SEO
                title="Appointment Confirmed | Prof. Dr. Javed Altaf"
                description="Your payment was successful and your consultation appointment is confirmed."
                url={`https://www.javedaltaf.com/payment-success/${orderId}`}
            />

            <div className="pf-result-container">

                {/* ─── Always show CONFIRMED immediately ─────────────────── */}
                <div className="pf-icon pf-icon--success">
                    <FaCheckCircle />
                </div>

                <h1 className="pf-title">Consultation Confirmed! 🎉</h1>

                <div className="pf-success-badge">
                    <FaShieldAlt />
                    <span>Payment received &amp; secured via PayFast</span>
                </div>

                {/* ─── Appointment Details (loads after IPN arrives) ──────── */}
                {loadingDetails ? (
                    <div className="pf-details-loading">
                        <div className="pf-skeleton-card">
                            <div className="pf-skeleton-title" />
                            <div className="pf-skeleton-grid">
                                <div className="pf-skeleton-item" />
                                <div className="pf-skeleton-item" />
                                <div className="pf-skeleton-item" />
                                <div className="pf-skeleton-item" />
                            </div>
                        </div>
                        <div className="pf-loading-note">
                            <FaSpinner className="spin-icon" />
                            <span>Fetching your appointment details…</span>
                            {lastChecked && (
                                <button
                                    className="pf-refresh-link"
                                    onClick={handleManualRefresh}
                                    disabled={manualChecking}
                                >
                                    {manualChecking ? 'Checking…' : 'Refresh'}
                                </button>
                            )}
                        </div>
                        <div className="pf-email-note">
                            <FaEnvelope />
                            <p>
                                A confirmation email will arrive at your inbox shortly.
                                If you paid via <strong>EasyPaisa or JazzCash</strong>, details may take up to 10 minutes to appear here.
                            </p>
                        </div>
                        {orderId && (
                            <div className="pf-basket-ref" style={{ marginTop: 16 }}>
                                Booking Reference: <code>{orderId}</code>
                            </div>
                        )}
                    </div>
                ) : (
                    apptData && (
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
                    )
                )}

                {/* ─── What Happens Next ──────────────────────────────────── */}
                <div className="pf-next-steps">
                    <h3>What Happens Next?</h3>
                    <div className="pf-step">
                        <div className="pf-step-icon"><FaEnvelope /></div>
                        <div>
                            <h5>Check Your Email</h5>
                            <p>A confirmation email is on its way. Dr. Javed Altaf will video call on your WhatsApp number 2 mins before.</p>
                        </div>
                    </div>
                    <div className="pf-step">
                        <div className="pf-step-icon"><FaVideo /></div>
                        <div>
                            <h5>Join on Time</h5>
                            <p>Be ready at your selected Saturday slot. Prof. Dr. Javed Altaf will join you for 20 minutes.</p>
                        </div>
                    </div>
                    <div className="pf-step">
                        <div className="pf-step-icon"><FaFileMedical /></div>
                        <div>
                            <h5>Prepare Your Reports</h5>
                            <p>Keep lab reports, ultrasounds, or prescriptions handy for the consultation.</p>
                        </div>
                    </div>
                </div>

                <Link to="/" className="btn btn-primary pf-home-btn">Return to Home</Link>
            </div>

            <style>{`
                .pf-result-page {
                    min-height: 100vh; background: var(--light-gray);
                    display: flex; align-items: center; justify-content: center;
                    padding: 120px 20px 60px;
                }
                .pf-result-container {
                    background: white; border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg); padding: 60px 50px;
                    max-width: 720px; width: 100%; text-align: center;
                }
                .pf-icon {
                    margin: 0 auto 24px; width: 80px; height: 80px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; font-size: 2.6rem;
                }
                .pf-icon--success {
                    background: #dcfce7; color: #16a34a;
                    box-shadow: 0 0 0 14px rgba(22,163,74,0.08);
                    animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
                }
                @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .spin-icon { animation: spin 1.2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .pf-title { font-size: 2rem; color: var(--primary-dark); margin-bottom: 14px; line-height: 1.25; }
                .pf-success-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
                    padding: 8px 18px; border-radius: 100px; font-size: 0.875rem;
                    font-weight: 600; margin-bottom: 28px;
                }
                /* ── Skeleton loading ── */
                .pf-details-loading { margin-bottom: 32px; }
                .pf-skeleton-card {
                    background: var(--secondary-color); border: 1.5px solid rgba(0,86,179,0.1);
                    border-radius: var(--radius-md); padding: 28px; margin-bottom: 16px;
                }
                .pf-skeleton-title {
                    height: 18px; background: #e5e7eb; border-radius: 6px;
                    width: 40%; margin: 0 auto 20px;
                    animation: shimmer 1.5s ease-in-out infinite;
                }
                .pf-skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .pf-skeleton-item {
                    height: 52px; background: #e5e7eb; border-radius: 8px;
                    animation: shimmer 1.5s ease-in-out infinite;
                }
                .pf-skeleton-item:nth-child(2) { animation-delay: 0.1s; }
                .pf-skeleton-item:nth-child(3) { animation-delay: 0.2s; }
                .pf-skeleton-item:nth-child(4) { animation-delay: 0.3s; }
                @keyframes shimmer { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
                .pf-loading-note {
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    font-size: 0.82rem; color: var(--text-light); margin-bottom: 14px;
                }
                .pf-refresh-link {
                    background: none; border: none; color: var(--primary-color);
                    font-size: 0.82rem; cursor: pointer; text-decoration: underline;
                    padding: 0; font-weight: 600;
                }
                .pf-email-note {
                    display: flex; align-items: flex-start; gap: 12px;
                    background: #eff6ff; border: 1px solid #bfdbfe;
                    border-radius: var(--radius-md); padding: 14px 18px;
                    text-align: left; font-size: 0.85rem; color: #1e40af; line-height: 1.5;
                }
                .pf-email-note svg { flex-shrink: 0; margin-top: 2px; }
                .pf-email-note p { margin: 0; }
                /* ── Summary card ── */
                .pf-summary-card {
                    background: var(--secondary-color); border: 1.5px solid rgba(0,86,179,0.15);
                    border-radius: var(--radius-md); padding: 28px; text-align: left; margin-bottom: 32px;
                }
                .pf-summary-title {
                    font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 20px;
                    padding-bottom: 12px; border-bottom: 1.5px solid rgba(0,86,179,0.1);
                }
                .pf-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
                .pf-summary-item { display: flex; align-items: center; gap: 12px; }
                .pf-sum-icon { color: var(--primary-color); font-size: 1.2rem; flex-shrink: 0; }
                .pf-sum-label { display: block; font-size: 0.75rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
                .pf-sum-value { display: block; font-size: 0.95rem; font-weight: 700; color: var(--text-dark); }
                .pf-sum-paid { color: #16a34a !important; }
                .pf-basket-ref { font-size: 0.82rem; color: var(--text-light); padding-top: 14px; border-top: 1px solid rgba(0,86,179,0.1); text-align: center; }
                .pf-basket-ref code { background: #dbeafe; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; margin-left: 6px; font-size: 0.8rem; }
                /* ── Next steps ── */
                .pf-next-steps { text-align: left; margin-bottom: 32px; }
                .pf-next-steps h3 { font-size: 1.15rem; color: var(--primary-dark); margin-bottom: 20px; text-align: center; }
                .pf-step { display: flex; gap: 18px; align-items: flex-start; margin-bottom: 20px; }
                .pf-step-icon { width: 44px; height: 44px; background: var(--secondary-color); color: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
                .pf-step h5 { font-size: 0.95rem; color: var(--primary-dark); margin-bottom: 4px; }
                .pf-step p { font-size: 0.875rem; color: var(--text-light); line-height: 1.5; margin: 0; }
                .pf-home-btn { padding: 14px 36px; font-size: 1rem; }
                @media (max-width: 640px) {
                    .pf-result-container { padding: 40px 24px; }
                    .pf-title { font-size: 1.5rem; }
                    .pf-summary-grid { grid-template-columns: 1fr; }
                    .pf-skeleton-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccess;
