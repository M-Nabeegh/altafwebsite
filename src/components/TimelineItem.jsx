import React from 'react';

const TimelineItem = ({ role, department, institution, period, details }) => {
  return (
    <div className="timeline-item fade-in">
      <div className="period-badge">{period}</div>
      <div className="timeline-content">
        <h3>{role}</h3>
        {department && <span className="dept">{department}</span>}
        <h4 className="institution">{institution}</h4>

        {details && details.length > 0 && (
          <ul className="details-list">
            {details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        )}
      </div>


    </div>
  );
};

export default TimelineItem;
