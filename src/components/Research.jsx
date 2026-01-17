import React from 'react';
import { publications } from '../data/content';
import { FaBookMedical, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Research = () => {
  // Take first 3 items
  const displayedPublications = publications.slice(0, 3);

  return (
    <section id="research" className="section bg-light">
      <div className="container">
        <div className="section-header text-center mb-4">
          <h2>Research & Publications</h2>
          <p>Contributing to medical science with over 40 peer-reviewed publications.</p>
        </div>

        <div className="publications-list">
          {displayedPublications.map((pub, index) => (
            <div key={index} className="pub-item fade-in">
              <FaBookMedical className="pub-icon" />
              <div className="pub-text">
                <p className="pub-title">{pub.title}</p>
                <span className="pub-journal">{pub.journal}, {pub.year}</span>
              </div>
            </div>
          ))}

          <p className="research-focus-text text-center mt-4">
            Prof. Dr. Javed Altaf’s research focuses on urolithiasis, minimally invasive surgery, pediatric urology, prostate disorders, and surgical outcomes, contributing to improved clinical practices nationally and internationally.
          </p>

          <div className="text-center mt-4">
            <Link to="/research" className="btn btn-outline">
              View All Publications <FaArrowRight style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>

      </div>


    </section>
  );
};

export default Research;
