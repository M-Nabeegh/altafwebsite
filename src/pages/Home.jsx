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
                            Prof. Dr. Javed Altaf follows a patient-centric, evidence-based approach to urological care. Every patient receives a thorough evaluation, clear explanation of treatment options, and a personalized care plan aligned with international clinical guidelines.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-dark)', marginTop: '20px' }}>
                            His priority is to utilize minimally invasive and organ-preserving techniques wherever possible to reduce complications, shorten recovery time, and improve quality of life.
                        </p>
                    </div>
                </section>
            </div>

            <div className="experience-section">
                <Experience />
            </div>

            {/* NEW SECTION: Pioneered & Landmark Highlight */}
            <div className="pioneered-section">
                <section className="section bg-primary-dark text-white text-center">
                    <div className="container">
                        <div className="section-header mb-4">
                            <h2 className="text-white">Pioneered & Landmark Procedures</h2>
                        </div>
                        <p style={{ maxWidth: '700px', margin: '0 auto 30px', fontSize: '1.1rem', opacity: 0.9 }}>
                            Recognized for introducing advanced urological procedures in Pakistan, Prof. Dr. Javed Altaf has successfully performed multiple landmark cases that reflect innovation, expertise, and patient safety.
                        </p>
                        <Link to="/pioneered-cases" className="btn btn-primary btn-lg" style={{ background: 'var(--accent-color)', border: 'none', color: 'white' }}>
                            👉 View Pioneered Cases <span style={{ marginLeft: '5px' }}>→</span>
                        </Link>
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
                                <h3>Diagnosis & Imaging</h3>
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

            <div className="social-proof-section">
                <SocialProof />
            </div>

            <div className="contact-section">
                <Contact />
            </div>

            <style jsx>{`
                .care-journey-steps {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    text-align: center;
                }
                .step-card {
                    background: white;
                    padding: 30px 20px;
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--light-gray);
                    transition: transform 0.3s ease;
                }
                .step-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-color);
                }
                .step-number {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-color);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.2rem;
                    margin: 0 auto 15px;
                }
                .step-card h3 {
                    font-size: 1.1rem;
                    margin-bottom: 8px;
                    color: var(--primary-dark);
                }
                .step-card p {
                    font-size: 0.9rem;
                    color: var(--text-light);
                    margin: 0;
                }

                /* MOBILE REORDERING */
                @media (max-width: 900px) {
                    .home-container {
                        display: flex;
                        flex-direction: column;
                    }

                    .hero-section { order: 1; }
                    .trust-stats-section { order: 2; }
                    .expertise-section { order: 3; }
                    .pioneered-section { order: 4; }
                    .experience-section { order: 5; }
                    .research-section { order: 6; }
                    .approach-section { order: 7; }
                    /* What's left comes after */
                    .care-journey-section { order: 8; }
                    .message-section { order: 9; }
                    .social-proof-section { order: 10; }
                    .contact-section { order: 11; }
                }
            `}</style>
        </div>
    );
};

export default Home;
