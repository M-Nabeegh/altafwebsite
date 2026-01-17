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


    </section>
  );
};

export default Expertise;
