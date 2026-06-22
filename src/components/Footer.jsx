import React from 'react';
import { doctorProfile, navLinks } from '../data/content';
import { FaFacebook, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" id="site-footer" style={{ backgroundColor: '#004494', color: 'white', padding: '60px 0 20px' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>{doctorProfile.name}</h3>
            <p className="designation">{doctorProfile.designation}</p>
            <p>{doctorProfile.specialty}</p>
            <div className="social-links">
              <a href={doctorProfile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile"><FaLinkedin /></a>
              <a href={`mailto:${doctorProfile.email}`} aria-label="Send Email"><FaEnvelope /></a>
              <a href={doctorProfile.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile"><FaFacebook /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {navLinks.map(link => (
                <li key={link.label}>
                  {link.href.startsWith('/#') ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <Link to={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal Policies</h4>
            <ul>
              <li><Link to="/pricing">Pricing Details</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy">Refund & Return Policy</Link></li>
              <li><Link to="/shipping-policy">Shipping & Delivery Policy</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
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
                <span><strong>Maryam Urology Clinic</strong><br />{doctorProfile.address}</span>
                <br />
                <a href={doctorProfile.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: '#a1c2fa', fontSize: '0.85rem', marginTop: '5px', display: 'inline-block' }}>View Clinic on Map</a>
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
