import React from 'react';
import { publications } from '../data/content';
import { FaBookMedical, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Research = () => {
  // Take first 4 items
  const displayedPublications = publications.slice(0, 4);

  return (
    <section id="research" className="section bg-light">
      <div className="container">
        <div className="section-header text-center mb-4">
          <h2>Research & Publications</h2>
          <p>Contributing to medical science with over 40 peer-reviewed publications and significant academic impact in urology and nephrology.</p>
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

      <style jsx>{`
        .bg-light {
           background-color: var(--secondary-color);
        }
        
        .publications-list {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .pub-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid var(--light-gray);
        }

        .pub-item:last-child {
          border-bottom: none;
        }

        .pub-icon {
          color: var(--primary-color);
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .pub-title {
          margin: 0;
          font-weight: 500;
          color: var(--text-dark);
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .pub-journal {
          font-size: 0.85rem;
          color: var(--text-light);
        }

        .mt-4 { margin-top: 20px; text-align: center; width: 100%; display: flex; justify-content: center; }
      `}</style>
    </section>
  );
};

export default Research;
