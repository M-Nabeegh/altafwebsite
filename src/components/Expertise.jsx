import React from 'react';
import { expertise } from '../data/content';
import { FaCheckCircle, FaLaptopMedical, FaUserMd, FaNotesMedical, FaSyringe, FaProcedures } from 'react-icons/fa';

const iconMap = {
  kidney: <FaNotesMedical />,
  prostate: <FaUserMd />,
  bladder: <FaSyringe />,
  laparoscopy: <FaProcedures />,
  pediatric: <FaCheckCircle />,
  "male-health": <FaCheckCircle /> // Fallback or add more specific icons
};

const Expertise = () => {
  return (
    <section id="expertise" className="section">
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2>Clinical Expertise</h2>
          <p>Specialized treatments delivering world-class urological care</p>
        </div>

        <div className="expertise-grid">
          {expertise.map((item, index) => (
            <div key={index} className="expertise-card fade-in">
              <div className="icon-box">
                {iconMap[item.icon] || <FaCheckCircle />}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .expertise-card {
          background: white;
          padding: 30px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid var(--light-gray);
        }

        .expertise-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-color);
        }

        .icon-box {
          width: 60px;
          height: 60px;
          background: var(--light-blue);
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .expertise-card h3 {
          font-size: 1.25rem;
          color: var(--primary-dark);
          margin-bottom: 10px;
        }

        .expertise-card p {
          color: var(--text-light);
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
};

export default Expertise;
