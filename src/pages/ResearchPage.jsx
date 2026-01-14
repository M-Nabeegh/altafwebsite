import React, { useState, useEffect } from 'react';
import { publications, stats } from '../data/content';
import { FaBookMedical, FaQuoteRight, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ResearchPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const togglePublication = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="research-page">
      <div className="page-header">
        <div className="container">
          <h1>Research & Publications</h1>
          <p>Advancing urological science through rigorous research and clinical studies.</p>
        </div>
      </div>

      <div className="container section">

        {/* Stats Section */}
        <div className="stats-box mb-5 fade-in">
          <div className="stat-row header-row">
            <div>Metric</div>
            <div>All</div>
            <div>Since 2021</div>
          </div>
          <div className="stat-row">
            <div className="label"><FaQuoteRight /> Citations</div>
            <div className="value">{stats.citations}</div>
            <div className="value">{stats.since2021.citations}</div>
          </div>
          <div className="stat-row">
            <div className="label">h-index</div>
            <div className="value">{stats.hIndex}</div>
            <div className="value">{stats.since2021.hIndex}</div>
          </div>
          <div className="stat-row">
            <div className="label">i10-index</div>
            <div className="value">{stats.i10Index}</div>
            <div className="value">{stats.since2021.i10Index}</div>
          </div>
        </div>

        <div className="publications-full-list">
          <h2 className="mb-4">Full List of Publications</h2>
          <div className="pub-grid">
            {publications.map((pub, index) => (
              <div key={index} className={`pub-card ${openIndex === index ? 'open' : ''}`} onClick={() => togglePublication(index)}>
                <div className="pub-header">
                  <div className="pub-icon-wrapper">
                    <FaBookMedical />
                  </div>
                  <div className="pub-title-block">
                    <h3>{pub.title}</h3>
                    <div className="pub-meta">
                      {pub.journal && <span className="journal">{pub.journal}</span>}
                      {pub.year && <span className="year">• {pub.year}</span>}
                    </div>
                  </div>
                  <div className="toggle-icon">
                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                <div className="pub-details">
                  <div className="details-content">
                    {pub.authors && <p className="authors"><strong>Authors:</strong> {pub.authors}</p>}
                    {pub.details && <p className="vol-info"><strong>Details:</strong> {pub.details}</p>}

                    <p className="summary-text">
                      {pub.summary || "Click to view full article details."}
                    </p>

                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read Full Article <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
                .page-header {
                    background: var(--primary-dark);
                    color: white;
                    padding: 80px 0;
                    text-align: center;
                    margin-bottom: 40px;
                }

                .page-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .stats-box {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    overflow: hidden;
                    border: 1px solid var(--medium-gray);
                }

                .stat-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    padding: 15px 20px;
                    border-bottom: 1px solid var(--light-gray);
                    align-items: center;
                }

                .stat-row:last-child {
                    border-bottom: none;
                }

                .header-row {
                    background: var(--secondary-color);
                    font-weight: 700;
                    color: var(--primary-dark);
                }

                .label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    color: var(--text-dark);
                }

                .value {
                    text-align: center;
                    font-weight: 500;
                    color: var(--primary-color);
                }

                .pub-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .pub-card {
                    background: white;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--medium-gray);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .pub-card:hover {
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-sm);
                }

                .pub-card.open {
                    background: #fcfcfc;
                    border-color: var(--primary-color);
                    box-shadow: var(--shadow-md);
                }

                .pub-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    padding: 20px;
                }

                .pub-icon-wrapper {
                    color: var(--primary-color);
                    font-size: 1.2rem;
                    margin-top: 3px;
                }

                .pub-title-block {
                    flex: 1;
                }

                .pub-title-block h3 {
                    font-size: 1.1rem;
                    color: var(--primary-dark);
                    margin-bottom: 5px;
                    line-height: 1.4;
                }

                .pub-meta {
                    font-size: 0.9rem;
                    color: var(--text-light);
                }

                .journal {
                    font-weight: 600;
                    color: var(--accent-color);
                }

                .toggle-icon {
                    color: var(--text-light);
                    font-size: 0.9rem;
                    margin-top: 5px;
                }

                .pub-details {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.4s ease-out;
                    background: var(--light-gray-bg); 
                }

                .pub-card.open .pub-details {
                    max-height: 500px; /* Arbitrary large height */
                    border-top: 1px solid var(--light-gray);
                }

                .details-content {
                    padding: 20px;
                    padding-left: 50px; /* Align with text */
                }

                .authors {
                    font-size: 0.9rem;
                    color: var(--text-dark);
                    margin-bottom: 5px;
                }

                .vol-info {
                    font-size: 0.9rem;
                    color: var(--text-light);
                    margin-bottom: 15px;
                    font-style: italic;
                }

                .summary-text {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: var(--text-dark);
                    margin-bottom: 20px;
                    padding-left: 10px;
                    border-left: 3px solid var(--accent-color);
                }

                .read-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--primary-color);
                    color: white;
                    padding: 8px 16px;
                    border-radius: var(--radius-md);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: background 0.2s;
                }

                .read-btn:hover {
                    background: var(--primary-dark);
                }
                
                @media (max-width: 600px) {
                    .details-content {
                        padding-left: 20px;
                    }
                }
            `}</style>
    </div>
  );
};

export default ResearchPage;
