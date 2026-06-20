import React from 'react';
import { doctorProfile } from '../data/content';
import CTAButton from './CTAButton';

const Hero = () => {
  return (
    <section id="hero" className="hero section">
      <div className="container hero-container">
        <div className="hero-content fade-in">
          <h1>{doctorProfile.name}</h1>
          <div className="qualifications-badge">
            MBBS | MCPS | FCPS | FACS | CHPE | DIP. IN LAPROSCOPIC UROLOGY (FRANCE) | DHA LICENSED UROLOGIST (DUBAI, UAE)
          </div>
          <h2 className="designation">{doctorProfile.designation}</h2>

          <p className="summary">
            Internationally trained urologist, Professor at LUMHS, and expert in advanced kidney stone and minimally invasive urological surgery with over 20 years of experience.
          </p>

          <div className="hero-cta">
            <CTAButton text="Book Online Consultation" />
            <div className="consultation-info">
              <p className="consult-details">Ideal for second opinions, follow-ups, and report reviews.</p>
            </div>
          </div>
        </div>

        <div className="hero-image fade-in">
          <div className="image-wrapper">
            <img src="/doctor-profile-v2.jpg" alt={doctorProfile.name} fetchpriority="high" width="600" height="600" style={{ objectFit: 'cover' }} />
            <span className="subtitle hero-image-tag">Consultant Urologist</span>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;
