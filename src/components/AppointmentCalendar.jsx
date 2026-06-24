import { useMemo, useState } from 'react';
import {
  FaCalendarCheck, FaChevronLeft, FaChevronRight, FaClock, FaUser,
} from 'react-icons/fa';
import {
  getInitialCalendarDate,
  groupOccupiedAppointmentsByDate,
  toLocalDateKey,
} from '../utils/appointmentCalendar';

const SLOT_TIMES = [
  '10:00 AM - 10:15 AM',
  '10:15 AM - 10:30 AM',
  '10:30 AM - 10:45 AM',
  '10:45 AM - 11:00 AM',
  '11:00 AM - 11:15 AM',
  '11:15 AM - 11:30 AM',
  '11:30 AM - 11:45 AM',
  '11:45 AM - 12:00 PM',
];

const AppointmentCalendar = ({ appointments, onOpenAppointment, onShowDate }) => {
  const [selectedDate, setSelectedDate] = useState(() => getInitialCalendarDate(appointments));
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = getInitialCalendarDate(appointments);
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  const appointmentsByDate = useMemo(
    () => groupOccupiedAppointmentsByDate(appointments),
    [appointments],
  );

  const selectedKey = toLocalDateKey(selectedDate);
  const selectedAppointments = appointmentsByDate.get(selectedKey) || [];
  const selectedBySlot = new Map(selectedAppointments.map(item => [item.slot_time, item]));
  const monthLabel = visibleMonth.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });
  const selectedLabel = selectedDate.toLocaleDateString('en-PK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const firstWeekday = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const changeMonth = offset => {
    const nextMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
    setVisibleMonth(nextMonth);
    setSelectedDate(nextMonth);
  };

  const selectDay = day => {
    setSelectedDate(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day, 12));
  };

  return (
    <div className="da-calendar-layout">
      <section className="da-calendar-card" aria-label="Appointment calendar">
        <div className="da-calendar-heading">
          <div>
            <span className="da-calendar-kicker"><FaCalendarCheck /> Schedule</span>
            <h2>{monthLabel}</h2>
          </div>
          <div className="da-calendar-nav">
            <button onClick={() => changeMonth(-1)} aria-label="Previous month"><FaChevronLeft /></button>
            <button onClick={() => changeMonth(1)} aria-label="Next month"><FaChevronRight /></button>
          </div>
        </div>

        <div className="da-calendar-weekdays" aria-hidden="true">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}
        </div>
        <div className="da-calendar-grid">
          {cells.map((day, index) => {
            if (!day) return <span className="da-calendar-empty-cell" key={`empty-${index}`} />;

            const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day, 12);
            const dateKey = toLocalDateKey(date);
            const dayAppointments = appointmentsByDate.get(dateKey) || [];
            const confirmedCount = dayAppointments.filter(item => item.status === 'confirmed').length;
            const pendingCount = dayAppointments.filter(item => item.status === 'payment_pending').length;
            const isSelected = dateKey === selectedKey;
            const isToday = dateKey === toLocalDateKey(new Date());

            return (
              <button
                key={dateKey}
                className={`da-calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${dayAppointments.length ? 'occupied' : ''}`}
                onClick={() => selectDay(day)}
                aria-label={`${dateKey}, ${dayAppointments.length} occupied slots`}
              >
                <span className="da-calendar-day-number">{day}</span>
                <span className="da-calendar-markers" aria-hidden="true">
                  {confirmedCount > 0 && <i className="confirmed" />}
                  {pendingCount > 0 && <i className="pending" />}
                </span>
                {dayAppointments.length > 0 && <small>{dayAppointments.length}/8</small>}
              </button>
            );
          })}
        </div>

        <div className="da-calendar-legend">
          <span><i className="confirmed" /> Confirmed</span>
          <span><i className="pending" /> Payment pending</span>
        </div>
      </section>

      <section className="da-day-schedule" aria-label={`Slots for ${selectedLabel}`}>
        <div className="da-day-schedule-heading">
          <div>
            <span>{selectedLabel}</span>
            <h3>{selectedAppointments.length} of {SLOT_TIMES.length} slots occupied</h3>
          </div>
          <button onClick={() => onShowDate(selectedKey)}>View list</button>
        </div>

        <div className="da-slot-list">
          {SLOT_TIMES.map(time => {
            const appointment = selectedBySlot.get(time);
            const isConfirmed = appointment?.status === 'confirmed';
            const isPending = appointment?.status === 'payment_pending';

            return (
              <button
                key={time}
                className={`da-calendar-slot ${isConfirmed ? 'confirmed' : ''} ${isPending ? 'pending' : ''}`}
                onClick={() => appointment && onOpenAppointment(appointment)}
                disabled={!appointment}
              >
                <span className="da-calendar-slot-time"><FaClock /> {time}</span>
                {appointment ? (
                  <span className="da-calendar-slot-patient"><FaUser /> {appointment.patient_name}</span>
                ) : (
                  <span className="da-calendar-slot-available">Available</span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AppointmentCalendar;
