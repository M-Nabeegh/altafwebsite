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
              <div className="phone-details">
                <span className="label">For Appointments:</span>
                <a href={`tel:${doctorProfile.phone}`}>{doctorProfile.phone}</a>
              </div>
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


    </section>
  );
};

export default Contact;
