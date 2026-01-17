import React from 'react';
import { doctorProfile, navLinks } from '../data/content';
import { FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer" id="contact" style={{ backgroundColor: '#004494', color: 'white', padding: '60px 0 20px' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>{doctorProfile.name}</h3>
            <p className="designation">{doctorProfile.designation}</p>
            <p>{doctorProfile.specialty}</p>
            <div className="social-links">
              <a href={doctorProfile.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href={`mailto:${doctorProfile.email}`}><FaEnvelope /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {navLinks.map(link => (
                <li key={link.label}><a href={link.href}>{link.label}</a></li>
              ))}
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <FaEnvelope /> <span>{doctorProfile.email}</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <div>
                <span>Liaquat University of Medical & Health Sciences (LUMHS), {doctorProfile.location}</span>
                <br />
                <a href={doctorProfile.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4285F4', fontSize: '0.85rem', marginTop: '5px', display: 'inline-block' }}>View Clinic on Map</a>
              </div>
            </div>
            {/* Placeholder for phone if available */}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Prof. Dr. Javed Altaf. All Rights Reserved.</p>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
