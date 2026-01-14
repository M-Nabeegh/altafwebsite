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

            <style jsx>{`
        .bg-light { background-color: var(--secondary-color); }
        
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .testimonial-card {
          background: white;
          padding: 30px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          position: relative;
        }

        .quote-icon {
          color: var(--primary-color);
          font-size: 1.5rem;
          opacity: 0.2;
          margin-bottom: 15px;
        }

        .text {
          font-style: italic;
          color: var(--text-dark);
          margin-bottom: 20px;
        }

        .author h4 {
          font-size: 1rem;
          margin: 0;
          color: var(--primary-dark);
        }

        .author span {
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .affiliations-section {
          margin-top: 80px;
          border-top: 1px solid var(--medium-gray);
          padding-top: 60px;
        }

        .logos-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 40px;
          align-items: center;
        }

        .logo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-light);
          font-weight: 500;
          opacity: 0.7;
          transition: 0.3s;
        }

        .logo-item:hover {
          opacity: 1;
          color: var(--primary-color);
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .mb-5 { margin-bottom: 50px; }
      `}</style>
        </section>
    );
};

export default SocialProof;
