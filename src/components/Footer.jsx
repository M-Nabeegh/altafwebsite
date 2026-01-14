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

      <style jsx>{`
        .footer {
          background-color: #004494 !important; /* Hardcoded Primary Dark to prevent loss */
          color: white !important;
          padding: 60px 0 20px;
          position: relative;
          z-index: 10;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer h3 {
          color: var(--white);
          margin-bottom: 10px;
        }

        .footer h4 {
          color: var(--accent-color);
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        .designation {
          color: rgba(255, 255, 255, 0.8) !important;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-links a {
          color: white;
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .social-links a:hover {
          opacity: 1;
          color: var(--accent-color);
        }

        .footer-col ul li {
          margin-bottom: 10px;
        }

        .footer-col ul a {
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-col ul a:hover {
          color: var(--white);
          padding-left: 5px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 15px;
          color: rgba(255, 255, 255, 0.8) !important;
        }
        
        .contact-item svg {
          margin-top: 4px;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: var(--text-light);
          font-size: 0.9rem;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
