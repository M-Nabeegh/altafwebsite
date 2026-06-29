import React, { useState, useEffect } from 'react';
import { publications, stats } from '../data/content';
import { FaBookMedical, FaQuoteRight, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import SEO from '../components/SEO';

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
      <SEO 
        title="Research & Publications | Prof. Dr. Javed Altaf" 
        description="Academic research, publications, and scientific contributions in urology and surgical advancements by Prof. Dr. Javed Altaf." 
        keywords="urology research, publications, scientific contributions, LUMHS urology, Dr Javed Altaf research"
        url="https://www.javedaltaf.com/research"
      />
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
              <div key={index} className={`pub-card ${openIndex === index ? 'open' : ''}`}>
                <div className="pub-header">
                  <button
                    type="button"
                    className="pub-expand-btn"
                    onClick={() => togglePublication(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`publication-details-${index}`}
                  >
                    <div className="pub-icon-wrapper">
                      <FaBookMedical />
                    </div>
                    <div className="pub-title-block">
                      <h3>{pub.title}</h3>
                      <div className="pub-meta">
                        {pub.year && <span className="year">{pub.year}</span>}
                        {pub.journal_citation && <span className="journal">{pub.journal_citation}</span>}
                      </div>
                    </div>
                    <div className="toggle-icon">
                      {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>

                  <div className="pub-card-action">
                    {pub.hasArticleLink ? (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-btn compact"
                      >
                        Article <FaExternalLinkAlt />
                      </a>
                    ) : (
                      <span className="link-unavailable">Link not available</span>
                    )}
                  </div>
                </div>

                <div className="pub-details" id={`publication-details-${index}`}>
                  <div className="details-content">
                    <p className="summary-text">
                      {pub.summary}
                    </p>

                    {pub.keywords?.length > 0 && (
                      <div className="keywords-list" aria-label="Publication keywords">
                        {pub.keywords.map((keyword) => (
                          <span key={keyword} className="keyword-chip">{keyword}</span>
                        ))}
                      </div>
                    )}

                    {pub.journal_citation && (
                      <p className="vol-info"><strong>Full citation:</strong> {pub.journal_citation}</p>
                    )}

                    {pub.hasArticleLink ? (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Article <FaExternalLinkAlt />
                      </a>
                    ) : (
                      <span className="link-unavailable large">Link not available</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
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
                    color: white;
                }

                .stats-box {
                    max-width: 600px;
                    margin: 0 auto 44px;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    overflow: hidden;
                    border: 1px solid var(--medium-gray);
                }

                .research-page .section.container {
                    width: min(100% - 32px, 1200px);
                    padding-left: 0;
                    padding-right: 0;
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

                .publications-full-list h2 {
                    margin-bottom: 22px;
                }

                .pub-card {
                    background: white;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--medium-gray);
                    overflow: hidden;
                    transition: all 0.3s ease;
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
                    width: 100%;
                }

                .pub-expand-btn {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    flex: 1;
                    border: 0;
                    background: transparent;
                    text-align: left;
                    font: inherit;
                    cursor: pointer;
                    min-width: 0;
                }

                .pub-expand-btn:focus-visible {
                    outline: 3px solid rgba(0, 86, 179, 0.35);
                    outline-offset: 4px;
                    border-radius: var(--radius-sm);
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
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .journal {
                    font-weight: 500;
                    color: var(--accent-color);
                }

                .year {
                    color: var(--primary-color);
                    font-weight: 700;
                }

                .pub-card-action {
                    flex-shrink: 0;
                    padding-top: 2px;
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
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .keywords-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin: -6px 0 18px;
                }

                .keyword-chip {
                    display: inline-flex;
                    align-items: center;
                    border-radius: var(--radius-full);
                    background: rgba(0, 112, 143, 0.1);
                    color: var(--accent-color);
                    font-size: 0.8rem;
                    font-weight: 700;
                    padding: 5px 10px;
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

                .read-btn.compact {
                    padding: 7px 12px;
                    white-space: nowrap;
                    font-size: 0.85rem;
                }

                .read-btn:hover {
                    background: var(--primary-dark);
                }

                .link-unavailable {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 7px 12px;
                    border-radius: var(--radius-md);
                    background: #f1f5f9;
                    color: var(--text-light);
                    font-size: 0.85rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .link-unavailable.large {
                    padding: 8px 16px;
                    font-size: 0.9rem;
                }
                
                @media (max-width: 600px) {
                    .research-page .section.container {
                        width: min(100% - 32px, 1200px);
                    }

                    .page-header {
                        padding: 48px 0 42px;
                        margin-bottom: 28px;
                    }

                    .publications-full-list h2 {
                        font-size: 1.55rem;
                        line-height: 1.15;
                        margin-bottom: 20px;
                        padding-left: 2px;
                        padding-right: 2px;
                    }

                    .stats-box {
                        margin-bottom: 36px;
                    }

                    .pub-grid {
                        gap: 16px;
                    }

                    .pub-header {
                        flex-direction: column;
                        gap: 12px;
                        padding: 16px;
                    }

                    .pub-expand-btn {
                        width: 100%;
                    }

                    .pub-card-action {
                        padding-left: 35px;
                    }

                    .details-content {
                        padding: 18px 16px;
                    }

                    .summary-text {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
    </div>
  );
};

export default ResearchPage;
