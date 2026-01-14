import React from 'react';
import CountUp from 'react-countup';
import { FaUserMd, FaProcedures, FaUserGraduate, FaChalkboardTeacher, FaBookMedical } from 'react-icons/fa';

const stats = [
    { icon: <FaUserMd />, count: 20, suffix: "+", label: "Years Experience" },
    { icon: <FaProcedures />, count: 20000, suffix: "+", label: "Surgeries" },
    { icon: <FaUserGraduate />, count: 200, suffix: "+", label: "Doctors Trained" },
    { icon: <FaChalkboardTeacher />, count: 10000, suffix: "+", label: "Students Taught" },
    { icon: <FaBookMedical />, count: 40, suffix: "+", label: "Publications" }
];

const TrustStats = () => {
    return (
        <section className="trust-stats section-sm">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-info">
                                <h3 className="stat-count">
                                    <CountUp end={stat.count} duration={2.5} separator="," suffix={stat.suffix} enableScrollSpy scrollSpyOnce />
                                </h3>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .trust-stats {
                    padding: 20px 0 30px;
                    background: var(--primary-dark);
                    margin-top: -20px; /* Connect with Hero visually */
                    position: relative;
                    z-index: 2;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                .stat-item {
                    background: rgba(255,255,255,0.08);
                    padding: 15px 10px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .stat-item:last-child {
                     grid-column: span 2;
                }
                .stat-icon {
                    font-size: 1.4rem;
                    color: var(--accent-color);
                    margin-bottom: 6px;
                }
                .stat-count {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin: 0;
                    color: white;
                    line-height: 1.2;
                }
                .stat-label {
                    font-size: 0.75rem;
                    margin: 4px 0 0;
                    color: rgba(255,255,255,0.8);
                    font-weight: 500;
                }

                @media (min-width: 900px) {
                    .trust-stats {
                        padding: 40px 0;
                        margin-top: 0;
                    }
                    .stats-grid {
                        grid-template-columns: repeat(5, 1fr);
                        gap: 20px;
                    }
                    .stat-item:last-child {
                        grid-column: auto;
                    }
                    .stat-icon {
                        font-size: 1.8rem;
                        margin-bottom: 10px;
                    }
                    .stat-count {
                        font-size: 1.8rem;
                    }
                    .stat-label {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default TrustStats;
