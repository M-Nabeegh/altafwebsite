import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaVideo } from 'react-icons/fa';

const PricingPolicy = () => {
    return (
        <div className="pricing-page section fade-in">
            <SEO 
                title="Consultation Pricing | Prof. Dr. Javed Altaf" 
                description="Clear pricing information for online urological consultations with Prof. Dr. Javed Altaf." 
                keywords="urologist pricing Hyderabad, Dr Javed Altaf fees, urology consultation price"
                url="https://www.javedaltaf.com/pricing"
            />
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="mb-2 text-center">Consultation Pricing</h1>
                <p className="lead text-center text-muted mb-5">Transparent pricing for top-tier urological care.</p>

                <div className="pricing-card-wrapper">
                    <div className="pricing-cardfeatured">
                        <span className="badge-popular">Online Consultation</span>
                        <div className="price-header">
                            <span className="currency">PKR</span>
                            <span className="amount">4,000</span>
                            <span className="period">/ session</span>
                        </div>
                        <p className="description">
                            Ideal for detailed second opinions, review of laboratory & radiology reports, and post-surgery follow-up advice from the comfort of your home.
                        </p>

                        <div className="features-list">
                            <div className="feature-item">
                                <FaCheckCircle className="check-icon" />
                                <span>20-minute direct one-on-one session with Prof. Dr. Javed Altaf</span>
                            </div>
                        </div>

                        <div className="quick-info">
                            <div className="info-box">
                                <FaCalendarAlt className="info-icon" />
                                <div>
                                    <h5>Available Days</h5>
                                    <p>Saturdays Only</p>
                                </div>
                            </div>
                            <div className="info-box">
                                <FaClock className="info-icon" />
                                <div>
                                    <h5>Time Window</h5>
                                    <p>10:00 AM - 12:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="action-button-box">
                            <Link to="/booking" className="btn btn-primary btn-booking">
                                Book Your Session Now
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pricing-faq mt-5">
                    <h3 className="text-center mb-4">Pricing FAQs</h3>
                    
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h5>Are there any hidden charges?</h5>
                            <p>No. The PKR 4,000 consultation fee is flat and covers your entire 20-minute session. No extra taxes or administration charges are added at checkout.</p>
                        </div>
                        <div className="faq-item">
                            <h5>What payment methods do you accept?</h5>
                            <p>We accept secure payments via major Credit/Debit cards (processed via Stripe), JazzCash, EasyPaisa, and Direct Bank Transfer.</p>
                        </div>
                        <div className="faq-item">
                            <h5>Can I get a refund if I cancel?</h5>
                            <p>Yes. You can cancel your slot up to 24 hours before the appointment time for a 100% refund. Please read our <Link to="/refund-policy" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Refund & Cancellation Policy</Link> for details.</p>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .pricing-page {
                    padding: 160px 0 80px;
                    min-height: 80vh;
                    background: var(--light-gray);
                }
                .pricing-card-wrapper {
                    max-width: 650px;
                    margin: 0 auto;
                }
                .pricing-cardfeatured {
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    border: 2px solid var(--primary-color);
                    padding: 50px;
                    position: relative;
                    overflow: hidden;
                }
                .badge-popular {
                    background: var(--primary-color);
                    color: white;
                    padding: 6px 16px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    border-radius: var(--radius-full);
                    display: inline-block;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .price-header {
                    display: flex;
                    align-items: baseline;
                    gap: 5px;
                    margin-bottom: 20px;
                }
                .currency {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-dark);
                }
                .amount {
                    font-size: 3.5rem;
                    font-weight: 800;
                    color: var(--primary-dark);
                    line-height: 1;
                }
                .period {
                    font-size: 1rem;
                    color: var(--text-light);
                    font-weight: 500;
                }
                .description {
                    color: var(--text-dark);
                    font-size: 1.05rem;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                .features-list {
                    margin-bottom: 35px;
                }
                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 15px;
                    font-size: 0.95rem;
                    color: var(--text-dark);
                }
                .check-icon {
                    color: #10b981;
                    font-size: 1.15rem;
                    margin-top: 3px;
                    flex-shrink: 0;
                }
                .quick-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    background: var(--light-gray);
                    padding: 20px;
                    border-radius: var(--radius-md);
                    margin-bottom: 35px;
                }
                .info-box {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                .info-icon {
                    color: var(--primary-color);
                    font-size: 1.1rem;
                    margin-top: 3px;
                }
                .info-box h5 {
                    font-size: 0.9rem;
                    margin-bottom: 3px;
                    color: var(--primary-dark);
                }
                .info-box p {
                    font-size: 0.85rem;
                    color: var(--text-light);
                    margin: 0;
                }
                .action-button-box {
                    text-align: center;
                }
                .btn-booking {
                    width: 100%;
                    padding: 16px;
                    font-size: 1.1rem;
                    text-align: center;
                    display: block;
                }
                .pricing-faq {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }
                .faq-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }
                .faq-item h5 {
                    font-size: 1.05rem;
                    color: var(--primary-dark);
                    margin-bottom: 10px;
                }
                .faq-item p {
                    font-size: 0.9rem;
                    color: var(--text-light);
                    line-height: 1.5;
                }
                @media (max-width: 768px) {
                    .pricing-page {
                        padding-top: 120px;
                    }
                    .pricing-cardfeatured {
                        padding: 30px 20px;
                    }
                    .quick-info {
                        grid-template-columns: 1fr;
                    }
                    .faq-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .pricing-faq {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PricingPolicy;
