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


    </section>
  );
};

export default Experience;
