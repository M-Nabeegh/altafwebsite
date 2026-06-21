import React, { useEffect, lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Expertise from '../components/Expertise';
import TrustStats from '../components/TrustStats';

const Experience = lazy(() => import('../components/Experience'));
const Research = lazy(() => import('../components/Research'));
const SocialProof = lazy(() => import('../components/SocialProof'));
const Contact = lazy(() => import('../components/Contact'));
import { useLocation, Link } from 'react-router-dom';
import { FaUserMd, FaNotesMedical, FaFileMedical, FaProcedures, FaHeartbeat } from 'react-icons/fa';
import pioneeredImg from '../assets/surgery_full.webp';
import pioneeredImgMobile from '../assets/surgery_full_mobile.webp';

import SEO from '../components/SEO';

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
            <SEO 
              title="Prof. Dr. Javed Altaf | Top Urologist in Hyderabad"
              description="Prof. Dr. Javed Altaf is a highly respected Professor of Urology and Head of Department at LUMHS with 20+ years of experience in complex urological surgeries."
              keywords="hyderabad, lumhs, urology, hyderabad doctor in hyderbad, kidney in hyderd, kidney specialist hyderabad, urologist in hyderabad, LUMHS urology, top kidney doctor"
              url="https://www.javedaltaf.com"
              image="/doctor-profile-v2.jpg"
            />
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

            <Suspense fallback={<div style={{ minHeight: '200vh' }}></div>}>
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
                                <img src={pioneeredImg} srcSet={`${pioneeredImgMobile} 640w, ${pioneeredImg} 1024w`} sizes="(max-width: 768px) 100vw, 50vw" alt="Dr. Javed Altaf performing landmark surgery" loading="lazy" width="1024" height="768" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-md)' }} />
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
                    <div className="container" style={{ maxWidth: '1000px' }}>
                        <div className="section-header text-center mb-5">
                            <h2>Message from Prof. Dr. Javed Altaf</h2>
                        </div>
                        <div className="message-flex-container" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                            <div style={{ flex: '2 1 400px', width: '100%' }}>
                                <blockquote className="message-quote-box" style={{
                                    fontSize: '1.25rem',
                                    fontStyle: 'italic',
                                    color: 'var(--text-dark)',
                                    borderLeft: '5px solid var(--primary-color)',
                                    paddingLeft: '30px',
                                    background: 'white',
                                    padding: '40px',
                                    borderRadius: '16px',
                                    margin: 0,
                                    lineHeight: '1.8',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    position: 'relative'
                                }}>
                                    <span style={{ fontSize: '4rem', color: 'var(--primary-color)', opacity: 0.1, position: 'absolute', top: '10px', left: '15px', fontFamily: 'serif', lineHeight: 1 }}>"</span>
                                    <p style={{ position: 'relative', zIndex: 1, margin: 0 }}>My mission is not only to treat disease, but to restore comfort, dignity, and confidence in my patients’ lives. I believe in ethical medicine, clear communication, and evidence-based care delivered with compassion.</p>
                                </blockquote>
                            </div>
                            <div className="message-img-container" style={{ flex: '0 1 auto', display: 'flex', justifyContent: 'center' }}>
                                <img src="/doctor-scrubs.webp" srcSet="/doctor-scrubs_mobile.webp 400w, /doctor-scrubs.webp 640w" sizes="(max-width: 768px) 100vw, 400px" alt="Prof. Dr. Javed Altaf in Scrubs" loading="lazy" width="400" height="480" className="message-img" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>



            <div className="contact-section">
                <SocialProof />
                <Contact />
            </div>
            </Suspense>
        </div>
    );
};

export default Home;
