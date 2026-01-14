import React from 'react';
import doctorImage from '../assets/doctor-profile.webp';
import { doctorProfile } from '../data/content';
import CTAButton from './CTAButton';

const Hero = () => {
  return (
    <section id="hero" className="hero section">
      <div className="container hero-container">
        <div className="hero-content fade-in">
          <span className="subtitle">Consultant Urologist</span>
          <h1>{doctorProfile.name}</h1>
          <div className="qualifications-badge">
            MBBS | MCPS | FCPS | FACS | CHPE | DIP. IN LAPROSCOPIC UROLOGY (FRANCE) | DHA LICENSED UROLOGIST (DUBAI, UAE)
          </div>
          <h2 className="designation">{doctorProfile.designation}</h2>

          <p className="summary">
            Prof. Dr. Javed Altaf is a highly respected Professor of Urology and Head of Department at Liaquat University of Medical & Health Sciences (LUMHS) with over two decades of surgical and academic excellence. He is internationally trained, research-driven, and deeply committed to patient-centric care.
          </p>

          <div className="hero-cta">
            <CTAButton text="Book Online Consultation" />
            <div className="consultation-info">
              <p className="consult-title">Online Consultation Available</p>
              <p className="consult-details">Consultation Fee: Rs. 3,500 <span className="separator">•</span> Ideal for second opinions, follow-ups, and report reviews.</p>
            </div>

          </div>
        </div>

        <div className="hero-image fade-in">
          <div className="image-wrapper">
            <img src={doctorImage} alt={doctorProfile.name} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
          padding-top: 120px; /* Accounts for fixed header */
          padding-bottom: 60px;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .subtitle {
          display: inline-block;
          background: rgba(0, 86, 179, 0.1);
          color: var(--primary-color);
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 3.5rem;
          margin-bottom: 10px;
          color: var(--primary-dark);
          line-height: 1.1;
        }

        .qualifications-badge {
            display: inline-block;
            background: transparent;
            color: var(--primary-dark);
            padding: 8px 0;
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            border-bottom: 2px solid var(--accent-color);
        }

        .designation {
          font-size: 1.35rem; /* Slightly smaller to balance */
          color: var(--primary-dark) !important;
          font-weight: 700;
          margin-bottom: 30px;
          line-height: 1.4;
          opacity: 1 !important;
        }

        .summary {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 40px;
          max-width: 500px;
        }

        .hero-cta {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }



        .separator {
          color: var(--primary-color);
        }

        .image-wrapper {
          position: relative;
          z-index: 1;
        }

        .image-wrapper::before {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100%;
          height: 100%;
          border: 10px solid rgba(0, 86, 179, 0.05);
          border-radius: var(--radius-lg);
          z-index: -1;
        }

        .image-wrapper img {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          transition: transform 0.3s ease;
        }

        .image-wrapper:hover img {
          transform: translateY(-10px);
        }

        .consultation-info {
            margin-top: -10px;
            margin-bottom: 5px;
        }

        .consult-title {
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 2px;
            font-size: 0.95rem;
        }

        .consult-details {
            font-size: 0.85rem;
            color: var(--text-light);
        }

        @media (max-width: 1100px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero {
            padding-top: 100px;
          }

          h1 {
            font-size: 2.2rem; /* Adjusted for mobile */
          }

          .summary {
            margin: 0 auto 30px;
            font-size: 1rem;
          }
          
          .hero-cta {
             align-items: center;
          }

          .image-wrapper {
            max-width: 90%; /* Better mobile fit */
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
