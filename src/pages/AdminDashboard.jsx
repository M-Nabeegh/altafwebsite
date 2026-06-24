import React, { useState, useEffect, useCallback } from 'react';
import {
    FaUserMd, FaCalendarAlt, FaClock, FaEnvelope, FaPhone,
    FaCheckCircle, FaTimesCircle, FaSpinner, FaSync, FaSignOutAlt,
    FaSearch, FaFilter, FaNotesMedical, FaMoneyBillWave, FaUsers,
    FaTrash, FaEdit, FaFilePrescription
} from 'react-icons/fa';
import SEO from '../components/SEO';
import AppointmentCalendar from '../components/AppointmentCalendar';
import PrescriptionDialog from '../components/PrescriptionDialog';

const STATUS_COLORS = {
    confirmed:        { bg: '#dcfce7', color: '#15803d', label: 'Confirmed' },
    payment_pending:  { bg: '#fef9c3', color: '#a16207', label: 'Pending' },
    failed:           { bg: '#fee2e2', color: '#b91c1c', label: 'Failed' },
    cancelled:        { bg: '#f3f4f6', color: '#6b7280', label: 'Cancelled' },
};

const ADMIN_STORAGE_KEY = 'da_admin_token';

const AdminDashboard = () => {
    const [authed, setAuthed]         = useState(() => Boolean(sessionStorage.getItem(ADMIN_STORAGE_KEY)));
    const [password, setPassword]     = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [appointments, setAppointments] = useState([]);
    const [stats, setStats]           = useState(null);
    const [loading, setLoading]       = useState(false);
    const [lastRefresh, setLastRefresh] = useState(null);

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDate, setFilterDate]   = useState('');
    const [search, setSearch]           = useState('');
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');
    const [prescriptionAppt, setPrescriptionAppt] = useState(null);
    const [viewMode, setViewMode] = useState('calendar');

    const fetchAppointments = useCallback(async (pass, status = 'all', date = '') => {
        setLoading(true);
        try {
            let url = `/api/admin/appointments?filter=${status}`;
            if (date) url += `&date=${date}`;
            const res = await fetch(url, {
                headers: { 'x-admin-password': pass || sessionStorage.getItem(ADMIN_STORAGE_KEY) }
            });
            if (res.status === 401) { sessionStorage.removeItem(ADMIN_STORAGE_KEY); setAuthed(false); return; }
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAppointments(data.appointments || []);
            setStats(data.stats);
            setLastRefresh(new Date());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const saved = sessionStorage.getItem(ADMIN_STORAGE_KEY);
        if (saved) { setAuthed(true); fetchAppointments(saved); }
    }, [fetchAppointments]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');
        try {
            const res = await fetch('/api/admin/appointments?filter=all', {
                headers: { 'x-admin-password': password }
            });
            if (res.ok) {
                sessionStorage.setItem(ADMIN_STORAGE_KEY, password);
                setAuthed(true);
                const data = await res.json();
                setAppointments(data.appointments || []);
                setStats(data.stats);
                setLastRefresh(new Date());
            } else {
                setLoginError('Incorrect password. Please try again.');
            }
        } catch {
            setLoginError('Connection error. Please check your network.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setAuthed(false);
        setPassword('');
        setAppointments([]);
        setStats(null);
    };

    const handleFilter = (status) => {
        setFilterStatus(status);
        fetchAppointments(null, status, filterDate);
    };

    const handleDateFilter = (date) => {
        setFilterDate(date);
        fetchAppointments(null, filterStatus, date);
    };

    const showDateInList = (date) => {
        setViewMode('appointments');
        setFilterStatus('all');
        setFilterDate(date);
        fetchAppointments(null, 'all', date);
    };

    const showCalendar = () => {
        setViewMode('calendar');
        setFilterStatus('all');
        setFilterDate('');
        fetchAppointments(null, 'all', '');
    };

    const handleRefresh = () => fetchAppointments(null, filterStatus, filterDate);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;
        try {
            const res = await fetch(`/api/admin/appointments?id=${id}`, {
                method: 'DELETE',
                headers: { 'x-admin-password': sessionStorage.getItem(ADMIN_STORAGE_KEY) }
            });
            if (res.ok) {
                setSelectedAppt(null);
                setIsEditing(false);
                handleRefresh();
            } else {
                alert('Failed to delete appointment.');
            }
        } catch {
            alert('Error deleting appointment.');
        }
    };

    const handleReschedule = async () => {
        try {
            const res = await fetch(`/api/admin/appointments`, {
                method: 'PATCH',
                headers: { 
                    'x-admin-password': sessionStorage.getItem(ADMIN_STORAGE_KEY),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedAppt.id, slot_date: editDate, slot_time: editTime })
            });
            if (res.ok) {
                setIsEditing(false);
                setSelectedAppt({...selectedAppt, slot_date: editDate, slot_time: editTime});
                handleRefresh();
                alert('Appointment rescheduled successfully!');
            } else {
                alert('Failed to reschedule appointment.');
            }
        } catch {
            alert('Error rescheduling appointment.');
        }
    };

    const openEditMode = () => {
        setEditDate(selectedAppt.slot_date);
        setEditTime(selectedAppt.slot_time);
        setIsEditing(true);
    };

    const openPrescription = () => {
        setPrescriptionAppt(selectedAppt);
        setSelectedAppt(null);
        setIsEditing(false);
    };

    const filteredAppts = appointments.filter(a => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            a.patient_name?.toLowerCase().includes(q) ||
            a.patient_email?.toLowerCase().includes(q) ||
            a.patient_phone?.includes(q) ||
            a.basket_id?.toLowerCase().includes(q)
        );
    });

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-PK', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    }) : '—';

    const formatDateTime = (d) => d ? new Date(d).toLocaleString('en-PK', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }) : '—';

    // ─── Login Screen ────────────────────────────────────────────────────────
    if (!authed) {
        return (
            <div className="da-login-page">
                <SEO title="Doctor Dashboard | Prof. Dr. Javed Altaf" description="Admin dashboard" url="https://www.javedaltaf.com/admin" />
                <div className="da-login-card">
                    <div className="da-login-icon"><FaUserMd /></div>
                    <h1 className="da-login-title">Doctor Dashboard</h1>
                    <p className="da-login-sub">Prof. Dr. Javed Altaf — Appointment Management</p>
                    <form onSubmit={handleLogin} className="da-login-form">
                        <div className="da-field">
                            <label htmlFor="adminPassword">Admin Password</label>
                            <input
                                id="adminPassword"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your admin password"
                                required
                            />
                        </div>
                        {loginError && <div className="da-login-error">{loginError}</div>}
                        <button type="submit" className="da-login-btn" disabled={isLoggingIn}>
                            {isLoggingIn ? <><FaSpinner className="da-spin" /> Verifying…</> : 'Sign In'}
                        </button>
                    </form>
                    <p className="da-login-hint">This page is only for the clinic administrator.</p>
                </div>
                <DaStyles />
            </div>
        );
    }

    // ─── Dashboard ───────────────────────────────────────────────────────────
    return (
        <div className="da-page">
            <SEO title="Doctor Dashboard | Prof. Dr. Javed Altaf" description="Admin dashboard" url="https://www.javedaltaf.com/admin" />

            {/* Header */}
            <div className="da-header">
                <div className="da-header-left">
                    <FaUserMd className="da-header-icon" />
                    <div>
                        <h1 className="da-header-title">Appointment Dashboard</h1>
                        <p className="da-header-sub">Prof. Dr. Javed Altaf — Urology Consultation Management</p>
                    </div>
                </div>
                <div className="da-header-right">
                    {lastRefresh && (
                        <span className="da-last-refresh">
                            Updated {lastRefresh.toLocaleTimeString('en-PK')}
                        </span>
                    )}
                    <button className="da-icon-btn" onClick={handleRefresh} title="Refresh" disabled={loading}>
                        <FaSync className={loading ? 'da-spin' : ''} />
                    </button>
                    <button className="da-logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </div>

            <nav className="da-view-switch" aria-label="Dashboard view">
                <button
                    className={viewMode === 'calendar' ? 'active' : ''}
                    onClick={showCalendar}
                >
                    <FaCalendarAlt /> Calendar
                </button>
                <button
                    className={viewMode === 'appointments' ? 'active' : ''}
                    onClick={() => setViewMode('appointments')}
                >
                    <FaUsers /> Appointments
                </button>
            </nav>

            {viewMode === 'calendar' ? (
                loading ? (
                    <div className="da-loading da-calendar-loading">
                        <FaSpinner className="da-spin da-loading-icon" />
                        <p>Loading schedule…</p>
                    </div>
                ) : (
                    <AppointmentCalendar
                        appointments={appointments}
                        onOpenAppointment={setSelectedAppt}
                        onShowDate={showDateInList}
                    />
                )
            ) : (
                <>
            {/* Stats */}
            {stats && (
                <div className="da-stats-grid">
                    <div className="da-stat-card da-stat-total">
                        <FaUsers className="da-stat-icon" />
                        <div>
                            <span className="da-stat-num">{stats.total}</span>
                            <span className="da-stat-label">Total Bookings</span>
                        </div>
                    </div>
                    <div className="da-stat-card da-stat-confirmed">
                        <FaCheckCircle className="da-stat-icon" />
                        <div>
                            <span className="da-stat-num">{stats.confirmed}</span>
                            <span className="da-stat-label">Confirmed</span>
                        </div>
                    </div>
                    <div className="da-stat-card da-stat-pending">
                        <FaClock className="da-stat-icon" />
                        <div>
                            <span className="da-stat-num">{stats.pending}</span>
                            <span className="da-stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="da-stat-card da-stat-revenue">
                        <FaMoneyBillWave className="da-stat-icon" />
                        <div>
                            <span className="da-stat-num">PKR {stats.revenue.toLocaleString('en-PK')}</span>
                            <span className="da-stat-label">Total Revenue</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="da-filters">
                <div className="da-filter-tabs">
                    {['all', 'confirmed', 'payment_pending', 'failed'].map(s => (
                        <button
                            key={s}
                            className={`da-filter-tab ${filterStatus === s ? 'active' : ''}`}
                            onClick={() => handleFilter(s)}
                        >
                            {s === 'all' ? 'All' : s === 'payment_pending' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="da-filter-right">
                    <div className="da-search-box">
                        <FaSearch className="da-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="da-date-filter">
                        <FaFilter className="da-filter-icon" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={e => handleDateFilter(e.target.value)}
                        />
                        {filterDate && (
                            <button className="da-clear-date" onClick={() => handleDateFilter('')}>✕</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="da-table-container">
                {loading ? (
                    <div className="da-loading">
                        <FaSpinner className="da-spin da-loading-icon" />
                        <p>Loading appointments…</p>
                    </div>
                ) : filteredAppts.length === 0 ? (
                    <div className="da-empty">
                        <FaNotesMedical className="da-empty-icon" />
                        <p>No appointments found.</p>
                    </div>
                ) : (
                    <table className="da-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Contact</th>
                                <th>Date &amp; Time</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Booked On</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppts.map(a => {
                                const s = STATUS_COLORS[a.status] || STATUS_COLORS.failed;
                                return (
                                    <tr key={a.id} className="da-row">
                                        <td data-label="Patient">
                                            <div className="da-patient-name">{a.patient_name}</div>
                                            <div className="da-basket-id">{a.basket_id}</div>
                                        </td>
                                        <td data-label="Contact">
                                            <div className="da-contact-row"><FaEnvelope />{a.patient_email}</div>
                                            <div className="da-contact-row"><FaPhone />{a.patient_phone}</div>
                                        </td>
                                        <td data-label="Date & Time">
                                            <div className="da-slot-date">{formatDate(a.slot_date)}</div>
                                            <div className="da-slot-time">{a.slot_time}</div>
                                        </td>
                                        <td data-label="Amount">
                                            <span className="da-amount">PKR {Number(a.amount).toLocaleString('en-PK')}</span>
                                        </td>
                                        <td data-label="Status">
                                            <span className="da-badge" style={{ background: s.bg, color: s.color }}>
                                                {s.label}
                                            </span>
                                        </td>
                                        <td data-label="Booked On" className="da-created">{formatDateTime(a.created_at)}</td>
                                        <td data-label="Actions">
                                            <button className="da-detail-btn" onClick={() => setSelectedAppt(a)}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="da-count-row">
                Showing {filteredAppts.length} of {appointments.length} appointments
            </div>
                </>
            )}

            {/* Detail Modal */}
            {selectedAppt && (
                <div className="da-modal-overlay" onClick={() => { setSelectedAppt(null); setIsEditing(false); }}>
                    <div className="da-modal" onClick={e => e.stopPropagation()}>
                        <div className="da-modal-header">
                            <h3>Appointment Details</h3>
                            <button className="da-modal-close" onClick={() => { setSelectedAppt(null); setIsEditing(false); }}>✕</button>
                        </div>
                        <div className="da-modal-body">
                            <div className="da-modal-row"><strong>Patient:</strong> {selectedAppt.patient_name}</div>
                            <div className="da-modal-row"><strong>Email:</strong> <a href={`mailto:${selectedAppt.patient_email}`}>{selectedAppt.patient_email}</a></div>
                            <div className="da-modal-row"><strong>Phone:</strong> <a href={`tel:${selectedAppt.patient_phone}`}>{selectedAppt.patient_phone}</a></div>
                            {isEditing ? (
                                <div className="da-modal-row" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>New Date:</label>
                                        <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }} />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold' }}>New Time:</label>
                                        <select value={editTime} onChange={e => setEditTime(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}>
                                            <option value="10:00 AM - 10:15 AM">10:00 AM - 10:15 AM</option>
                                            <option value="10:15 AM - 10:30 AM">10:15 AM - 10:30 AM</option>
                                            <option value="10:30 AM - 10:45 AM">10:30 AM - 10:45 AM</option>
                                            <option value="10:45 AM - 11:00 AM">10:45 AM - 11:00 AM</option>
                                            <option value="11:00 AM - 11:15 AM">11:00 AM - 11:15 AM</option>
                                            <option value="11:15 AM - 11:30 AM">11:15 AM - 11:30 AM</option>
                                            <option value="11:30 AM - 11:45 AM">11:30 AM - 11:45 AM</option>
                                            <option value="11:45 AM - 12:00 PM">11:45 AM - 12:00 PM</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={handleReschedule} style={{ flex: 1, padding: '8px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                                        <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '8px', background: '#e2e8f0', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="da-modal-row"><strong>Date:</strong> {formatDate(selectedAppt.slot_date)}</div>
                                    <div className="da-modal-row"><strong>Time:</strong> {selectedAppt.slot_time}</div>
                                </>
                            )}
                            <div className="da-modal-row"><strong>Amount:</strong> PKR {Number(selectedAppt.amount).toLocaleString('en-PK')}</div>
                            <div className="da-modal-row"><strong>Status:</strong> {selectedAppt.status}</div>
                            <div className="da-modal-row"><strong>Payment:</strong> {selectedAppt.payment_status}</div>
                            <div className="da-modal-row"><strong>Reference:</strong> <code>{selectedAppt.basket_id}</code></div>
                            {selectedAppt.notes && (
                                <div className="da-modal-row"><strong>Notes:</strong> {selectedAppt.notes}</div>
                            )}
                            <div className="da-modal-row"><strong>Booked:</strong> {formatDateTime(selectedAppt.created_at)}</div>
                        </div>
                        <div className="da-modal-footer" style={{ display: 'block' }}>
                            {selectedAppt.status === 'confirmed' && selectedAppt.payment_status === 'paid' && (
                                <button className="da-prescription-open-btn" onClick={openPrescription}>
                                    <FaFilePrescription /> Create Prescription
                                </button>
                            )}
                            <div style={{ display: 'flex', gap: '12px', width: '100%', marginBottom: '10px' }}>
                                <a href={`mailto:${selectedAppt.patient_email}?subject=Regarding Your Consultation on ${selectedAppt.slot_date}`} className="da-modal-email-btn" style={{ flex: 1 }}>
                                    <FaEnvelope /> Email
                                </a>
                                <a href={`https://wa.me/92${selectedAppt.patient_phone?.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="da-modal-wa-btn" style={{ flex: 1 }}>
                                    WhatsApp
                                </a>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                                <button onClick={openEditMode} style={{ flex: 1, padding: '11px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <FaEdit /> Reschedule
                                </button>
                                <button onClick={() => handleDelete(selectedAppt.id)} style={{ flex: 1, padding: '11px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <FaTrash /> Cancel / Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {prescriptionAppt && (
                <PrescriptionDialog
                    appointment={prescriptionAppt}
                    onClose={() => setPrescriptionAppt(null)}
                />
            )}

            <DaStyles />
        </div>
    );
};

// Styles component
const DaStyles = () => (
    <style>{`
        /* ── Page ── */
        .da-login-page {
            min-height: 100vh; background: #0f172a;
            display: flex; align-items: center; justify-content: center; padding: 40px 20px;
        }
        .da-login-card {
            background: white; border-radius: 16px; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
            padding: 56px 48px; max-width: 420px; width: 100%; text-align: center;
        }
        .da-login-icon {
            width: 72px; height: 72px; background: #0056b3; color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
            margin: 0 auto 20px; box-shadow: 0 8px 20px rgba(0,86,179,0.3);
        }
        .da-login-title { font-size: 1.7rem; color: #0c1a2e; margin-bottom: 6px; }
        .da-login-sub { font-size: 0.875rem; color: #64748b; margin-bottom: 32px; }
        .da-login-form { text-align: left; }
        .da-field { margin-bottom: 20px; }
        .da-field label { display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 8px; }
        .da-field input {
            width: 100%; padding: 12px 16px; border: 1.5px solid #d1d5db; border-radius: 10px;
            font-size: 1rem; outline: none; transition: border-color 0.2s;
        }
        .da-field input:focus { border-color: #0056b3; }
        .da-login-error {
            background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626;
            border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; margin-bottom: 16px;
        }
        .da-login-btn {
            width: 100%; padding: 14px; background: #0056b3; color: white; border: none;
            border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer;
            transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .da-login-btn:hover:not(:disabled) { background: #003d82; }
        .da-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .da-login-hint { font-size: 0.78rem; color: #9ca3af; margin-top: 24px; }
        /* ── Dashboard ── */
        .da-page {
            min-height: 100vh; width: 100%; max-width: 100%; background: #f1f5f9; padding: 0 0 60px;
            overflow-x: hidden; overflow-x: clip; overscroll-behavior-x: none; touch-action: pan-y;
        }
        .da-header {
            background: #0c1a2e; color: white; padding: 20px 40px;
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
        }
        .da-header-left { display: flex; align-items: center; gap: 16px; }
        .da-header-icon { font-size: 2rem; color: #60a5fa; flex-shrink: 0; }
        .da-header-title { font-size: 1.4rem; font-weight: 800; color: white; margin: 0 0 2px; }
        .da-header-sub { font-size: 0.82rem; color: #94a3b8; margin: 0; }
        .da-header-right { display: flex; align-items: center; gap: 12px; }
        .da-last-refresh { font-size: 0.78rem; color: #64748b; }
        .da-icon-btn {
            background: rgba(255,255,255,0.1); border: none; color: white; width: 38px; height: 38px;
            border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background 0.2s;
        }
        .da-icon-btn:hover { background: rgba(255,255,255,0.2); }
        .da-logout-btn {
            background: #dc2626; color: white; border: none; border-radius: 8px;
            padding: 9px 16px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
            display: flex; align-items: center; gap: 6px; transition: background 0.2s;
        }
        .da-logout-btn:hover { background: #b91c1c; }
        .da-view-switch {
            position: sticky; top: 0; z-index: 20; display: grid; grid-template-columns: 1fr 1fr;
            gap: 6px; padding: 10px 40px; background: rgba(255,255,255,0.96);
            border-bottom: 1px solid #e2e8f0; backdrop-filter: blur(12px);
        }
        .da-view-switch button {
            min-height: 42px; border: none; border-radius: 10px; background: transparent; color: #64748b;
            font-size: 0.86rem; font-weight: 750; cursor: pointer; display: flex; align-items: center;
            justify-content: center; gap: 8px;
        }
        .da-view-switch button.active { background: #0c1a2e; color: white; box-shadow: 0 4px 12px rgba(15,23,42,0.16); }
        /* Calendar */
        .da-calendar-layout {
            display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
            gap: 20px; padding: 24px 40px; width: 100%; max-width: 1440px; margin: 0 auto;
        }
        .da-calendar-card, .da-day-schedule {
            min-width: 0; background: white; border: 1px solid #e2e8f0; border-radius: 16px;
            box-shadow: 0 4px 18px rgba(15,23,42,0.06);
        }
        .da-calendar-card { padding: 22px; }
        .da-calendar-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
        .da-calendar-kicker {
            display: flex; align-items: center; gap: 7px; color: #2563eb; font-size: 0.72rem;
            font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
        }
        .da-calendar-heading h2 { margin: 3px 0 0; color: #0f172a; font-size: 1.35rem; }
        .da-calendar-nav { display: flex; gap: 8px; }
        .da-calendar-nav button {
            width: 40px; height: 40px; border: 1px solid #cbd5e1; border-radius: 10px; background: white;
            color: #334155; cursor: pointer; display: flex; align-items: center; justify-content: center;
        }
        .da-calendar-weekdays, .da-calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
        .da-calendar-weekdays { margin-bottom: 6px; }
        .da-calendar-weekdays span {
            text-align: center; color: #94a3b8; font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
        }
        .da-calendar-grid { gap: 5px; }
        .da-calendar-empty-cell { min-height: 66px; }
        .da-calendar-day {
            position: relative; min-width: 0; min-height: 66px; padding: 8px 6px; border: 1px solid transparent;
            border-radius: 10px; background: #f8fafc; color: #334155; cursor: pointer; text-align: left;
            display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;
        }
        .da-calendar-day:hover { border-color: #93c5fd; }
        .da-calendar-day.today { border-color: #60a5fa; }
        .da-calendar-day.selected { background: #0f4c9a; color: white; border-color: #0f4c9a; }
        .da-calendar-day-number { font-size: 0.86rem; font-weight: 800; }
        .da-calendar-day small { align-self: flex-end; font-size: 0.64rem; font-weight: 800; opacity: 0.82; }
        .da-calendar-markers { display: flex; gap: 4px; }
        .da-calendar-markers i, .da-calendar-legend i {
            display: inline-block; width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .da-calendar-markers i.confirmed, .da-calendar-legend i.confirmed { background: #22c55e; }
        .da-calendar-markers i.pending, .da-calendar-legend i.pending { background: #f59e0b; }
        .da-calendar-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 16px; color: #64748b; font-size: 0.72rem; }
        .da-calendar-legend span { display: flex; align-items: center; gap: 6px; }
        .da-day-schedule { padding: 20px; }
        .da-day-schedule-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
        .da-day-schedule-heading span { color: #64748b; font-size: 0.76rem; font-weight: 650; }
        .da-day-schedule-heading h3 { margin: 3px 0 0; color: #172033; font-size: 1rem; }
        .da-day-schedule-heading button {
            flex-shrink: 0; border: none; border-radius: 8px; background: #e0e7ff; color: #3730a3;
            padding: 8px 10px; font-size: 0.72rem; font-weight: 750; cursor: pointer;
        }
        .da-slot-list { display: grid; gap: 8px; }
        .da-calendar-slot {
            min-width: 0; width: 100%; min-height: 54px; border: 1px solid #e2e8f0; border-radius: 10px;
            background: #f8fafc; padding: 9px 11px; display: flex; flex-direction: column; align-items: flex-start;
            justify-content: center; gap: 4px; text-align: left;
        }
        .da-calendar-slot.confirmed { background: #f0fdf4; border-color: #86efac; cursor: pointer; }
        .da-calendar-slot.pending { background: #fffbeb; border-color: #fcd34d; cursor: pointer; }
        .da-calendar-slot-time, .da-calendar-slot-patient {
            min-width: 0; display: flex; align-items: center; gap: 7px; font-size: 0.75rem;
        }
        .da-calendar-slot-time { color: #334155; font-weight: 750; }
        .da-calendar-slot-patient { color: #166534; font-weight: 700; overflow-wrap: anywhere; }
        .da-calendar-slot.pending .da-calendar-slot-patient { color: #92400e; }
        .da-calendar-slot-available { color: #94a3b8; font-size: 0.7rem; }
        .da-calendar-loading { margin: 40px; background: white; border-radius: 16px; }
        /* Stats */
        .da-stats-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
            padding: 28px 40px; background: #0c1a2e;
        }
        .da-stat-card {
            background: rgba(255,255,255,0.07); border-radius: 12px; padding: 20px 22px;
            display: flex; align-items: center; gap: 16px; border: 1px solid rgba(255,255,255,0.08); min-width: 0;
        }
        .da-stat-icon { font-size: 1.6rem; flex-shrink: 0; }
        .da-stat-total .da-stat-icon { color: #60a5fa; }
        .da-stat-confirmed .da-stat-icon { color: #4ade80; }
        .da-stat-pending .da-stat-icon { color: #fbbf24; }
        .da-stat-revenue .da-stat-icon { color: #34d399; }
        .da-stat-num { display: block; font-size: 1.6rem; font-weight: 800; color: white; line-height: 1.2; }
        .da-stat-label { font-size: 0.78rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        /* Filters */
        .da-filters {
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
            padding: 20px 40px; background: white; border-bottom: 1px solid #e2e8f0;
        }
        .da-filter-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        .da-filter-tab {
            padding: 8px 18px; border-radius: 100px; font-size: 0.85rem; font-weight: 600;
            border: 1.5px solid #d1d5db; background: white; cursor: pointer; color: #374151;
            transition: all 0.2s;
        }
        .da-filter-tab.active { background: #0056b3; color: white; border-color: #0056b3; }
        .da-filter-tab:hover:not(.active) { border-color: #0056b3; color: #0056b3; }
        .da-filter-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .da-search-box {
            display: flex; align-items: center; gap: 10px;
            border: 1.5px solid #d1d5db; border-radius: 10px; padding: 9px 14px;
            background: #f9fafb;
        }
        .da-search-icon { color: #9ca3af; font-size: 0.875rem; }
        .da-search-box input { border: none; background: transparent; font-size: 0.875rem; outline: none; min-width: 200px; }
        .da-date-filter {
            display: flex; align-items: center; gap: 8px;
            border: 1.5px solid #d1d5db; border-radius: 10px; padding: 9px 14px; background: #f9fafb;
        }
        .da-filter-icon { color: #9ca3af; font-size: 0.875rem; }
        .da-date-filter input { border: none; background: transparent; font-size: 0.875rem; outline: none; }
        .da-clear-date {
            background: #ef4444; color: white; border: none; border-radius: 50%;
            width: 20px; height: 20px; font-size: 0.7rem; cursor: pointer; display: flex;
            align-items: center; justify-content: center;
        }
        /* Table */
        .da-table-container { margin: 0 40px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .da-table { width: 100%; border-collapse: collapse; }
        .da-table thead { background: #f8fafc; }
        .da-table th { padding: 14px 18px; text-align: left; font-size: 0.78rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; }
        .da-row { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
        .da-row:hover { background: #f8fafc; }
        .da-table td { padding: 14px 18px; vertical-align: middle; }
        .da-patient-name { font-weight: 700; font-size: 0.95rem; color: #0c1a2e; margin-bottom: 3px; }
        .da-basket-id { font-size: 0.75rem; color: #94a3b8; font-family: monospace; }
        .da-contact-row { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 0.82rem; color: #475569; margin-bottom: 4px; overflow-wrap: anywhere; }
        .da-slot-date { font-weight: 600; font-size: 0.875rem; color: #0c1a2e; margin-bottom: 3px; }
        .da-slot-time { font-size: 0.82rem; color: #64748b; }
        .da-amount { font-weight: 700; color: #15803d; font-size: 0.95rem; }
        .da-badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 0.78rem; font-weight: 700; }
        .da-created { font-size: 0.8rem; color: #94a3b8; }
        .da-detail-btn {
            background: #eff6ff; color: #1d4ed8; border: none; border-radius: 6px;
            padding: 7px 14px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .da-detail-btn:hover { background: #1d4ed8; color: white; }
        .da-loading, .da-empty {
            padding: 80px; text-align: center; color: #94a3b8;
        }
        .da-loading-icon, .da-empty-icon { font-size: 2.5rem; margin-bottom: 16px; }
        .da-count-row { text-align: right; padding: 12px 40px; font-size: 0.82rem; color: #94a3b8; }
        /* Modal */
        .da-modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex;
            align-items: center; justify-content: center; z-index: 1000; padding: 20px;
        }
        .da-modal {
            background: white; border-radius: 16px; width: 100%; max-width: 500px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.3); overflow: hidden;
        }
        .da-modal-header {
            background: #0c1a2e; color: white; padding: 20px 24px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .da-modal-header h3 { margin: 0; font-size: 1.1rem; }
        .da-modal-close { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }
        .da-modal-body { padding: 24px; }
        .da-modal-row { padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #374151; overflow-wrap: anywhere; }
        .da-modal-row a { color: #0056b3; text-decoration: none; }
        .da-modal-row code { background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.82rem; }
        .da-modal-footer { padding: 16px 24px; background: #f8fafc; display: flex; gap: 12px; }
        .da-modal-email-btn {
            flex: 1; background: #0056b3; color: white; border: none; border-radius: 8px;
            padding: 11px; font-size: 0.875rem; font-weight: 600; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            text-decoration: none; transition: background 0.2s;
        }
        .da-modal-email-btn:hover { background: #003d82; }
        .da-modal-wa-btn {
            flex: 1; background: #16a34a; color: white; border: none; border-radius: 8px;
            padding: 11px; font-size: 0.875rem; font-weight: 600; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            text-decoration: none; transition: background 0.2s;
        }
        .da-modal-wa-btn:hover { background: #15803d; }
        .da-prescription-open-btn {
            width: 100%; margin-bottom: 12px; padding: 13px 16px; border: none; border-radius: 9px;
            background: #6d28d9; color: white; font-size: 0.9rem; font-weight: 700; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 9px;
            box-shadow: 0 6px 16px rgba(109,40,217,0.2);
        }
        .da-prescription-open-btn:hover { background: #5b21b6; }
        .da-prescription-overlay { z-index: 1100; }
        .da-prescription-modal { max-width: 620px; max-height: calc(100dvh - 24px); overflow-y: auto; }
        .da-prescription-header { background: linear-gradient(135deg, #4c1d95, #6d28d9); }
        .da-prescription-header h3 { margin-top: 5px; }
        .da-prescription-kicker {
            display: flex; align-items: center; gap: 7px; color: #ddd6fe; font-size: 0.74rem;
            font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
        }
        .da-prescription-body { padding: 22px 24px 12px; }
        .da-prescription-patient {
            display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px;
        }
        .da-prescription-patient span {
            background: #f5f3ff; color: #5b21b6; border-radius: 999px; padding: 6px 10px;
            font-size: 0.76rem; font-weight: 650;
        }
        .da-prescription-field { display: block; margin-bottom: 16px; }
        .da-prescription-field > span {
            display: block; color: #27364a; font-size: 0.84rem; font-weight: 750; margin-bottom: 7px;
        }
        .da-prescription-field strong { color: #dc2626; }
        .da-prescription-field small { color: #94a3b8; font-weight: 500; }
        .da-prescription-field textarea {
            display: block; width: 100%; resize: vertical; min-height: 88px; padding: 12px 14px;
            border: 1.5px solid #cbd5e1; border-radius: 10px; background: #fff; color: #172033;
            font: inherit; font-size: 0.9rem; line-height: 1.55; outline: none;
        }
        .da-prescription-field textarea:focus {
            border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }
        .da-prescription-privacy {
            display: flex; gap: 9px; align-items: flex-start; background: #eff6ff; color: #1e40af;
            border-radius: 9px; padding: 10px 12px; font-size: 0.76rem; line-height: 1.45;
        }
        .da-prescription-privacy svg { flex-shrink: 0; margin-top: 2px; }
        .da-prescription-error {
            margin-top: 12px; padding: 10px 12px; border: 1px solid #fecaca; border-radius: 8px;
            background: #fef2f2; color: #b91c1c; font-size: 0.8rem; font-weight: 600;
        }
        .da-prescription-ready { padding: 18px 4px 8px; text-align: center; }
        .da-prescription-ready-icon {
            width: 72px; height: 72px; margin: 0 auto 14px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            background: #ede9fe; color: #6d28d9; font-size: 1.9rem;
        }
        .da-prescription-ready h4 { margin: 0 0 8px; color: #172033; font-size: 1.08rem; }
        .da-prescription-ready p {
            max-width: 430px; margin: 0 auto 18px; color: #64748b; font-size: 0.84rem; line-height: 1.55;
        }
        .da-prescription-ready-actions { display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; }
        .da-prescription-ready-actions button {
            min-height: 48px; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 750;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .da-prescription-share { background: #16a34a; color: white; }
        .da-prescription-open { background: #e0e7ff; color: #3730a3; }
        .da-prescription-edit-again {
            margin-top: 14px; padding: 8px 14px; border: none; background: transparent; color: #6d28d9;
            font-size: 0.8rem; font-weight: 700; text-decoration: underline; cursor: pointer;
        }
        .da-prescription-actions {
            display: grid; grid-template-columns: 0.7fr 1.6fr; gap: 10px; padding: 14px 24px 20px;
        }
        .da-prescription-actions button {
            min-height: 46px; border-radius: 10px; border: none; font-size: 0.86rem; font-weight: 750;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .da-prescription-actions button:disabled { opacity: 0.65; cursor: wait; }
        .da-prescription-cancel { background: #e2e8f0; color: #334155; }
        .da-prescription-generate { background: #16a34a; color: white; }
        .da-prescription-generate:hover:not(:disabled) { background: #15803d; }
        /* Spinner */
        .da-spin { animation: da-spin 1s linear infinite; }
        @keyframes da-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        /* Responsive */
        @media (max-width: 1024px) {
            .da-view-switch { padding: 10px 16px; }
            .da-calendar-layout { grid-template-columns: 1fr; padding: 18px 16px; }
            .da-stats-grid { grid-template-columns: repeat(2,1fr); }
            .da-table-container { margin: 0 16px; }
            .da-filters { padding: 16px; }
            .da-header { padding: 16px 20px; }
            .da-count-row { padding: 12px 16px; }
        }
        @media (max-width: 640px) {
            .da-page { padding-bottom: calc(28px + env(safe-area-inset-bottom)); }
            .da-view-switch { padding: 8px 12px; }
            .da-view-switch button { min-height: 40px; font-size: 0.8rem; }
            .da-calendar-layout { padding: 12px; gap: 12px; }
            .da-calendar-card, .da-day-schedule { border-radius: 14px; }
            .da-calendar-card { padding: 14px 10px; }
            .da-calendar-heading { padding: 0 4px; margin-bottom: 16px; }
            .da-calendar-heading h2 { font-size: 1.12rem; }
            .da-calendar-nav button { width: 36px; height: 36px; }
            .da-calendar-grid { gap: 3px; }
            .da-calendar-empty-cell, .da-calendar-day { min-height: 52px; }
            .da-calendar-day { padding: 6px 5px; border-radius: 8px; }
            .da-calendar-day-number { font-size: 0.78rem; }
            .da-calendar-day small { font-size: 0.56rem; }
            .da-day-schedule { padding: 15px 13px; }
            .da-day-schedule-heading { align-items: center; }
            .da-header { align-items: flex-start; }
            .da-header-left { gap: 10px; }
            .da-header-icon { font-size: 1.5rem; }
            .da-header-title { font-size: 1.08rem; }
            .da-header-sub, .da-last-refresh { display: none; }
            .da-header-right { margin-left: auto; }
            .da-logout-btn { width: 38px; height: 38px; padding: 0; justify-content: center; font-size: 0; }
            .da-logout-btn svg { font-size: 0.95rem; }
            .da-stats-grid { grid-template-columns: 1fr 1fr; padding: 16px; gap: 12px; }
            .da-stat-card { padding: 14px; }
            .da-stat-num { font-size: 1.2rem; }
            .da-filter-right { width: 100%; min-width: 0; }
            .da-search-box { width: 100%; min-width: 0; }
            .da-search-box input { width: 100%; min-width: 0; }
            .da-date-filter { max-width: 100%; }
            /* Mobile Table to Card Layout */
            .da-table, .da-table tbody, .da-table tr, .da-table td { display: block; width: 100%; }
            .da-table thead { display: none; }
            .da-table-container { background: transparent; box-shadow: none; margin: 0 16px; }
            .da-row { 
                background: white; border-radius: 12px; margin-bottom: 16px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;
                padding: 16px; position: relative; min-width: 0; overflow: hidden;
            }
            .da-table td { 
                display: flex; justify-content: space-between; align-items: center; 
                padding: 10px 0; border: none; border-bottom: 1px dashed #e2e8f0; text-align: right;
            }
            .da-table td:last-child { border-bottom: none; padding-bottom: 0; padding-top: 12px; justify-content: center; }
            .da-table td::before { 
                content: attr(data-label); font-weight: 700; font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 15px; text-align: left;
            }
            .da-patient-name { font-size: 1.05rem; }
            .da-table td:nth-child(1) { flex-direction: column; align-items: flex-start; gap: 4px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
            .da-table td:nth-child(1)::before { display: none; }
            .da-table td:nth-child(2) { flex-direction: column; align-items: flex-end; gap: 4px; }
            .da-table td:nth-child(3) { flex-direction: column; align-items: flex-end; gap: 4px; }
            .da-detail-btn { width: 100%; padding: 10px; }
            .da-modal-overlay { padding: 0; align-items: flex-end; }
            .da-modal {
                max-width: none; max-height: calc(100dvh - 10px); border-radius: 18px 18px 0 0;
                overflow-y: auto;
            }
            .da-modal-header { position: sticky; top: 0; z-index: 2; padding: 16px 18px; }
            .da-modal-body { padding: 18px; }
            .da-modal-footer { padding: 14px 18px 20px !important; }
            .da-modal-footer > div, .da-modal-footer a, .da-modal-footer button { min-width: 0; }
            .da-prescription-modal { max-height: 100dvh; }
            .da-prescription-body { padding: 16px 18px 8px; }
            .da-prescription-field textarea { font-size: 16px; }
            .da-search-box input,
            .da-date-filter input,
            .da-modal input,
            .da-modal select { font-size: 16px !important; }
            .da-prescription-actions {
                position: sticky; bottom: 0; background: white; padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
                box-shadow: 0 -8px 20px rgba(15,23,42,0.08); grid-template-columns: 0.65fr 1.7fr;
            }
        }
    `}</style>
);

export default AdminDashboard;
