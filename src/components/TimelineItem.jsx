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

            <style jsx>{`
        .timeline-item {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 30px;
          margin-bottom: 40px;
          position: relative;
        }

        .period-badge {
          background: var(--primary-color);
          color: white;
          padding: 8px 15px;
          border-radius: var(--radius-full);
          font-weight: 600;
          font-size: 0.9rem;
          text-align: center;
          align-self: flex-start;
          box-shadow: var(--shadow-sm);
        }

        .timeline-content {
          background: white;
          padding: 25px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border-left: 5px solid var(--accent-color);
        }

        .timeline-content h3 {
          color: var(--primary-dark);
          margin-bottom: 5px;
          font-size: 1.2rem;
        }

        .dept {
          display: block;
          color: var(--accent-color);
          font-weight: 500;
          margin-bottom: 5px;
        }

        .institution {
          font-weight: 400;
          color: var(--text-light);
          font-size: 1rem;
          margin-bottom: 15px;
        }

        .details-list {
          list-style: disc;
          padding-left: 20px;
          color: var(--text-dark);
        }

        .details-list li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .timeline-item {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
      `}</style>
        </div>
    );
};

export default TimelineItem;
