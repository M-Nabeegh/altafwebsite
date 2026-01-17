import React from 'react';
import doctorImage from '../assets/doctor-profile-v2.jpg';
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
            Prof. Dr. Javed Altaf is a senior consultant urologist and Professor at LUMHS with over two decades of experience in advanced and minimally invasive urological surgery. He is internationally trained, and nationally recognized for advanced PCNL surgery and surgical training, delivering evidence-based, patient-centred care.
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
            <img src={doctorImage} alt={doctorProfile.name} />
          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;
