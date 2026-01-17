import React from 'react';
import CountUp from 'react-countup';
import { FaUserMd, FaProcedures, FaUserGraduate, FaChalkboardTeacher, FaBookMedical } from 'react-icons/fa';

const stats = [
    { icon: <FaUserMd />, count: 20, suffix: "+", label: "Years Experience" },
    { icon: <FaProcedures />, count: 15000, suffix: "+", label: "Surgeries" },
    { icon: <FaUserGraduate />, count: 100, suffix: "+", label: "Doctors Trained" },
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

        </section>
    );
};

export default TrustStats;
