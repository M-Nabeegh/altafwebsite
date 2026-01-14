import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page section fade-in">
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="mb-5 text-center">Privacy Policy</h1>

                <div className="policy-content">
                    <h3>1. Introduction</h3>
                    <p>Welcome to Prof. Dr. Javed Altaf's website. We utilize your personal data to provide and improve our services.</p>

                    <h3>2. Data Collection</h3>
                    <p>We collect information you provide directly to us, such as when you book an appointment, fill out a form, or communicate with us.</p>

                    <h3>3. Use of Information</h3>
                    <p>Your information is used to schedule consultations, process payments, and send you important updates regarding your appointment.</p>

                    <h3>4. Third-Party Services</h3>
                    <p>We use third-party services like Stripe for payments and Calendly for scheduling. Please review their respective privacy policies.</p>

                    <h3>5. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at javed_altafdr@yahoo.com.</p>
                </div>
            </div>
            <style jsx>{`
                .privacy-page {
                    padding: 120px 0;
                    min-height: 80vh;
                }
                .policy-content h3 {
                    margin-top: 30px;
                    margin-bottom: 15px;
                    color: var(--primary-dark);
                }
                .policy-content p {
                    line-height: 1.7;
                    color: var(--text-dark);
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;
