import React from 'react';
import { FaQuoteLeft, FaHospitalSymbol, FaUniversity } from 'react-icons/fa';

const SocialProof = () => {
  const testimonials = [
    {
      name: "Ahmed Khan",
      text: "Prof. Dr. Javed Altaf is a lifesaver. His diagnosis was accurate and the surgery went perfectly. Highly recommended.",
      role: "Patient from Hyderabad"
    },
    {
      name: "Sara Ali",
      text: "Very professional and kind doctor. He explained everything in detail before the procedure.",
      role: "Patient from Karachi"
    },
    {
      name: "Muhammad Usman",
      text: "The staff and facilities were excellent. Dr. Javed's expertise is truly world-class.",
      role: "Recovered Patient"
    }
  ];

  const affiliations = [
    "Liaquat University of Medical & Health Sciences (LUMHS)",
    "College of Physicians & Surgeons Pakistan (CPSP)",
    "American College of Surgeons (ACS)",
    "European Urological Association (EUA)",
    "Pakistan Association of Urological Surgeons (PAUS)"
  ];

  return (
    <section className="section bg-light">
      <div className="container">
        {/* Testimonials */}
        <div className="section-header text-center mb-4">
          <h2>Patient Stories</h2>
          <p>Trusted by thousands of patients across the region</p>
        </div>

        <div className="testimonials-grid mb-5">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card fade-in">
              <FaQuoteLeft className="quote-icon" />
              <p className="text">{t.text}</p>
              <div className="author">
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Affiliations */}
        <div className="affiliations-section">
          <h3 className="text-center mb-3">Affiliations & Memberships</h3>
          <div className="logos-grid">
            {affiliations.map((org, index) => (
              <div key={index} className="logo-item">
                <FaUniversity className="logo-icon" />
                <span>{org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};

export default SocialProof;
