import React from 'react';
import { doctorProfile, clinicHours } from '../data/content';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaCalendarCheck } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2>Contact & Clinic Info</h2>
          <p>Visit us at our primary clinic or book an appointment online</p>
        </div>

        <div className="contact-grid">
          {/* Clinic Info Box */}
          <div className="contact-card info-card">
            <h3><FaMapMarkerAlt /> Clinic Location</h3>
            <p className="location-name">Maryam Urology Clinic</p>
            <p className="address">{doctorProfile.address}</p>

            <a href={doctorProfile.googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn-map">
              <FaMapMarkerAlt /> View on Google Maps
            </a>

            <div className="hospital-note">
              <strong>Note:</strong> Surgeries performed at Bone Care Hospital.
            </div>

            <div className="phone-block">
              <FaPhoneAlt />
              <a href={`tel:${doctorProfile.phone}`}>{doctorProfile.phone}</a>
            </div>
          </div>

          {/* Hours Box */}
          <div className="contact-card hours-card">
            <h3><FaClock /> Clinic Hours</h3>
            <ul className="hours-list">
              {clinicHours.map((item, index) => (
                <li key={index} className={item.time === "Closed" ? "closed" : ""}>
                  <span className="day">{item.day}</span>
                  <span className="time">{item.time}</span>
                </li>
              ))}
            </ul>
            <p className="disclaimer">*Hours might differ. Please call to confirm.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 900px;
          margin: 0 auto;
        }

        .contact-card {
          background: white;
          padding: 30px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--medium-gray);
        }

        .contact-card h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--primary-dark);
          font-size: 1.3rem;
        }

        .location-name {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--primary-color);
          margin-bottom: 10px;
        }

        .address {
          color: var(--text-dark);
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .btn-map {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #4285F4;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 20px;
          transition: background 0.2s;
        }

        .btn-map:hover {
            background: #3367d6;
            color: white;
        }

        .hospital-note {
          background: var(--secondary-color);
          padding: 10px 15px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 20px;
        }

        .phone-block {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .phone-block a {
          color: var(--text-dark);
          text-decoration: none;
        }
        
        .phone-block a:hover {
          color: var(--primary-color);
        }

        .hours-list {
          list-style: none;
        }

        .hours-list li {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--light-gray);
          font-size: 0.95rem;
        }

        .hours-list li:last-child {
          border-bottom: none;
        }

        .hours-list li.closed {
          color: var(--text-light);
          opacity: 0.7;
        }

        .day {
          font-weight: 500;
        }

        .disclaimer {
          font-size: 0.8rem;
          color: var(--text-light);
          margin-top: 15px;
          font-style: italic;
        }

        @media (max-width: 600px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
