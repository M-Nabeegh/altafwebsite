import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Expertise from '../components/Expertise';
import Experience from '../components/Experience';
import Research from '../components/Research'; // This will be the summary version
import SocialProof from '../components/SocialProof';
import TrustStats from '../components/TrustStats';
import Contact from '../components/Contact';
import { useLocation, Link } from 'react-router-dom';
import { FaUserMd, FaNotesMedical, FaFileMedical, FaProcedures, FaHeartbeat } from 'react-icons/fa';
import pioneeredImg from '../assets/pioneered-surgery.jpg';

const Home = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="home-container">
            <div className="hero-section">
                <Hero />
            </div>

            <div className="trust-stats-section">
                <TrustStats />
            </div>

            <div className="expertise-section">
                <Expertise />
            </div>

            {/* NEW SECTION: Treatment Approach */}
            <div className="approach-section">
                <section className="section bg-light">
                    <div className="container text-center" style={{ maxWidth: '800px' }}>
                        <div className="section-header mb-4">
                            <h2>How Prof. Dr. Javed Altaf Treats His Patients</h2>
                        </div>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
                            Prof. Dr. Javed Altaf practices patient-centered, evidence-based urology, offering clear guidance and care aligned with international standards, with a strong focus on minimally invasive, organ-preserving treatment for faster recovery and better quality of life.
                        </p>
                    </div>
                </section>
            </div>

            <div className="experience-section">
                <Experience />
            </div>



            {/* NEW SECTION: Pioneered & Landmark Highlight */}
            <div className="pioneered-section">
                <section className="section bg-primary-dark text-white">
                    <div className="container">
                        <div className="pioneered-grid">
                            <div className="pioneered-content text-center text-lg-start">
                                <div className="section-header mb-4">
                                    <h2 className="text-white">Pioneered & Landmark Procedures</h2>
                                </div>
                                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '30px' }}>
                                    Recognized for introducing advanced urological procedures in Pakistan, Prof. Dr. Javed Altaf has successfully performed multiple landmark cases that reflect innovation, expertise, and patient safety.
                                </p>
                                <Link to="/pioneered-cases" className="btn btn-primary btn-lg" style={{ background: 'var(--accent-color)', border: 'none', color: 'white' }}>
                                    👉 View Pioneered Cases <span style={{ marginLeft: '5px' }}>→</span>
                                </Link>
                            </div>
                            <div className="pioneered-image">
                                <img src={pioneeredImg} alt="Dr. Javed Altaf performing landmark surgery" />
                                <div className="badge-overlay">First in Pakistan</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* NEW SECTION: Patient Care Journey */}
            <div className="care-journey-section">
                <section className="section bg-light">
                    <div className="container">
                        <div className="section-header text-center mb-5">
                            <h2>Your Care Journey</h2>
                        </div>
                        <div className="care-journey-steps">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <h3>Initial Consultation</h3>
                                <p>Detailed assessment and discussion</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <h3>Imaging & Diagnosis</h3>
                                <p>Evidence-based evaluation</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <h3>Treatment Plan</h3>
                                <p>Personalized medical or surgical plan</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">4</div>
                                <h3>Procedure / Surgery</h3>
                                <p>Minimally invasive where possible</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">5</div>
                                <h3>Follow-Up</h3>
                                <p>Long-term care and monitoring</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="research-section">
                <Research />
            </div>

            {/* NEW SECTION: Message from Doctor */}
            <div className="message-section">
                <section className="section">
                    <div className="container text-center" style={{ maxWidth: '800px' }}>
                        <div className="section-header mb-4">
                            <h2>Message from Prof. Dr. Javed Altaf</h2>
                        </div>
                        <blockquote style={{
                            fontSize: '1.25rem',
                            fontStyle: 'italic',
                            color: 'var(--text-dark)',
                            borderLeft: '4px solid var(--accent-color)',
                            paddingLeft: '20px',
                            margin: '0 auto',
                            background: '#f9f9f9',
                            padding: '30px',
                            borderRadius: '0 8px 8px 0'
                        }}>
                            "My mission is not only to treat disease, but to restore comfort, dignity, and confidence in my patients’ lives. I believe in ethical medicine, clear communication, and evidence-based care delivered with compassion."
                        </blockquote>
                    </div>
                </section>
            </div>



            <div className="contact-section">
                <Contact />
            </div>


        </div>
    );
};

export default Home;
