import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import lumhsLogo from '../assets/lumhs-logo.webp';

const Experience = () => {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header text-center mb-4">
          <h2>Experience & Leadership</h2>
          <p>Over two decades of excellence in urological surgery and education</p>
        </div>

        <div className="timeline-container">
          {/* Summary view only */}
          <div className="timeline-block">
            <div className="timeline-icon logo-icon">
              <img src={lumhsLogo} alt="LUMHS Logo" />
            </div>
            <div className="timeline-content">
              <h3>Liaquat University of Medical & Health Sciences (LUMHS)</h3>

              <div className="role-item">
                <span className="year">2024 – Present</span>
                <h4>Professor & HOD – Unit 1 Urology</h4>
              </div>
              <p className="mt-2 text-muted">Leading the department and supervising unit clinical operations.</p>
              <p className="mt-2 text-muted">
                In addition to clinical leadership, Prof. Dr. Javed Altaf has played a pivotal role in mentoring postgraduate trainees, developing surgical protocols, and introducing advanced urological procedures within the institution.
              </p>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/experience" className="btn btn-outline">
              View Full Experience & Qualifications <FaArrowRight style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .timeline-block {
          position: relative;
          padding-left: 60px;
          margin-bottom: 40px;
        }

        .timeline-block::before {
          content: '';
          position: absolute;
          left: 24px;
          top: 0;
          height: 100%;
          width: 2px;
          background: var(--medium-gray);
        }

        .timeline-icon {
          position: absolute;
          left: 0;
          top: 0;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          z-index: 1;
        }

        .timeline-icon.logo-icon {
          background: white;
          border: 2px solid var(--primary-color);
          padding: 2px;
          overflow: hidden;
        }

        .timeline-icon.logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .timeline-content {
          background: white;
          padding: 30px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--medium-gray);
        }

        .timeline-content h3 {
          color: var(--primary-dark);
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .role-item {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
          padding-bottom: 15px;
        }

        .year {
          min-width: 120px;
          font-weight: 600;
          color: var(--accent-color);
          font-size: 0.9rem;
        }

        .mt-2 { margin-top: 10px; }
        .text-muted { color: var(--text-light); font-size: 0.95rem; }

        .mt-5 { margin-top: 50px; }
        .text-xl { font-size: 1.5rem; font-weight: 700; color: var(--accent-color); }
      `}</style>
    </section>
  );
};

export default Experience;
