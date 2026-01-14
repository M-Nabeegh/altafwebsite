import React, { useEffect } from 'react';
import { fullExperience, education, skills } from '../data/content';
import TimelineItem from '../components/TimelineItem';
import { FaGraduationCap, FaTools, FaBriefcase, FaCertificate } from 'react-icons/fa';
import surgeryImage from '../assets/surgery.webp';

// Import Logos
import baqaiLogo from '../assets/baqai-logo.webp';
import acsLogo from '../assets/acs-logo-v2.webp';
import ircadLogo from '../assets/ircad-logo.webp';
import cpspLogo from '../assets/cpsp-logo-v2.webp';
import rcpsLogo from '../assets/rcps-logo.webp';
import lumhsLogo from '../assets/lumhs-logo-v2.webp';

const ExperiencePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const affiliations = [
    { logo: baqaiLogo, name: "Baqai Medical University" },
    { logo: acsLogo, name: "American College of Surgeons" },
    { logo: lumhsLogo, name: "Liaquat University of Medical & Health Sciences" },
    { logo: cpspLogo, name: "College of Physicians & Surgeons Pakistan" },
    { logo: rcpsLogo, name: "Royal College of Physicians & Surgeons" },
    { logo: ircadLogo, name: "IRCAD France (Dip. Laparoscopic Surgery)" },
  ];

  // Helper to get logo for a specific degree/institution
  const getLogo = (degree, institution) => {
    if (institution.includes("Baqai")) return baqaiLogo;
    if (institution.includes("American College of Surgeons")) return acsLogo;
    if (institution.includes("IRCAD")) return ircadLogo;
    if (institution.includes("College of Physicians and Surgeons Pakistan")) return cpspLogo;
    if (institution.includes("Royal College")) return rcpsLogo;
    if (institution.includes("Liaquat")) return lumhsLogo;
    return null;
  };

  return (
    <div className="experience-page">
      <div className="page-header">
        <div className="container">
          <h1>Experience & Qualifications</h1>
          <p>A journey of surgical excellence and academic leadership spanning over two decades.</p>
        </div>
      </div>

      <div className="container section">

        {/* Professional Experience Section (Moved to First) */}
        <div className="experience-list mb-5">
          <h2 className="mb-4"><FaBriefcase className="icon-heading" /> Professional Experience</h2>

          <div className="surgery-banner mb-5 fade-in">
            <img src={surgeryImage} alt="Surgical Excellence" loading="lazy" />
            <div className="banner-caption">
              <span>Pioneering Advanced Surgical Techniques</span>
            </div>
          </div>

          <div className="timeline-wrapper">
            {fullExperience.map((exp, index) => (
              <TimelineItem
                key={index}
                role={exp.role}
                department={exp.department}
                institution={exp.institution}
                period={exp.period}
                details={exp.details}
              />
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills-section mb-5">
          <h2 className="mb-4"><FaTools className="icon-heading" /> Skills & Expertise</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={index} className="skill-tag">{skill}</div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="education-section mb-5">
          <h2 className="mb-4"><FaGraduationCap className="icon-heading" /> Education & Certifications</h2>
          <div className="education-grid">
            {education.map((edu, index) => {
              const logo = getLogo(edu.degree, edu.institution);
              return (
                <div key={index} className="education-card">
                  <div className="edu-content">
                    <span className="year-badge">{edu.year}</span>
                    <h3>{edu.degree}</h3>
                    <p>{edu.institution}</p>
                  </div>
                  {logo && (
                    <div className="edu-logo">
                      <img src={logo} alt="Institution Logo" loading="lazy" />
                    </div>
                  )}
                </div>
              );
            })}
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
          color: white;
        }

        .icon-heading {
          color: var(--accent-color);
          margin-right: 10px;
        }

        /* Affiliation Logos */
        .logos-row {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .logo-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: white;
            box-shadow: var(--shadow-md);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border: 2px solid var(--accent-color);
            transition: transform 0.3s ease;
        }

        .logo-circle:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }

        .logo-circle img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 50%;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .skill-tag {
          background: var(--secondary-color);
          color: var(--primary-dark);
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: 0.3s;
        }

        .skill-tag:hover {
          background: var(--primary-color);
          color: white;
        }

        .education-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .education-card {
          background: white;
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--medium-gray);
          position: relative;
          transition: transform 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .education-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-sm);
          border-color: var(--accent-color);
        }

        .edu-content {
            flex: 1;
        }

        .edu-logo {
            width: 50px;
            height: 50px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .edu-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            opacity: 0.9;
        }

        .year-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-light);
          margin-bottom: 8px;
        }

        .education-card h3 {
          font-size: 1.05rem;
          color: var(--text-dark);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .education-card p {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .mb-4 { margin-bottom: 30px; }
        .mb-5 { margin-bottom: 60px; }

        .timeline-wrapper {
          position: relative;
        }

        .surgery-banner {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 40px;
          height: 300px;
          box-shadow: var(--shadow-md);
        }

        .surgery-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%; 
        }

        .banner-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
          padding: 20px;
        }

        .banner-caption span {
          font-weight: 600;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
        }

        .timeline-wrapper::before {
          content: '';
          position: absolute;
          left: 24px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: var(--medium-gray);
          z-index: 0;
        }
        
        /* Mobile Optimization */
        @media (max-width: 768px) {
            .page-header h1 {
                font-size: 2rem;
            }
            
            .education-grid {
                grid-template-columns: 1fr; /* Single column on mobile */
            }

            .logos-row {
                gap: 15px;
            }

            .logo-circle {
                width: 70px;
                height: 70px;
                padding: 8px;
            }
            
            .surgery-banner {
                height: 200px;
            }
            
            .education-card {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .edu-logo {
                margin-top: 10px;
                width: 40px;
                height: 40px;
            }
        }
      `}</style>
    </div>
  );
};

export default ExperiencePage;
