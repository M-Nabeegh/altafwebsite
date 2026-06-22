import React from 'react';
import SEO from '../components/SEO';

const TermsAndConditions = () => {
    return (
        <div className="terms-page section fade-in">
            <SEO 
                title="Terms & Conditions | Prof. Dr. Javed Altaf" 
                description="Terms and conditions for scheduling online consultations and utilizing urology services by Prof. Dr. Javed Altaf." 
                keywords="terms and conditions, Dr Javed Altaf terms, urologist consultation terms"
                url="https://www.javedaltaf.com/terms-and-conditions"
            />
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="mb-5 text-center">Terms & Conditions</h1>

                <div className="terms-content">
                    <h3>1. Services Offered</h3>
                    <p>Prof. Dr. Javed Altaf provides medical consulting services online and in-person. Online consultations are designed for report reviews, second opinions, and general urological guidance. They are not a substitute for intensive physical examinations or emergency treatments.</p>

                    <h3>2. Non-Emergency Care Disclaimer</h3>
                    <p style={{ fontWeight: '600', color: 'var(--accent-color)' }}>
                        If you are experiencing a medical emergency, acute severe pain, or any life-threatening symptoms, please visit your nearest hospital emergency room immediately. Our online services are strictly for scheduled appointments and non-emergency consulting.
                    </p>

                    <h3>3. Booking & Consultation Fees</h3>
                    <p>
                        The fee for a single online consultation session is <strong>PKR 4,000</strong>. This fee covers a 15-minute video or audio call session on the selected Saturday. Payment must be processed and confirmed in full to secure the consultation slot.
                    </p>

                    <h3>4. Scheduling & Time Slots</h3>
                    <p>
                        Online consultations are strictly available on <strong>Saturdays between 10:00 AM and 12:00 PM</strong>. Slots are booked on a first-come, first-served basis. Patients must be available on the WhatsApp number entered during booking; Prof. Dr. Javed Altaf will start the video call approximately 2 minutes before the scheduled time. If a patient is late or unavailable, the session will still end at the scheduled slot time to avoid delaying subsequent patients.
                    </p>

                    <h3>5. Patient Responsibilities</h3>
                    <p>
                        Patients are required to provide accurate, complete, and truthful medical records, reports, and history during the booking process or prior to the start of the consultation. Prof. Dr. Javed Altaf is not liable for any issues arising from incorrect or incomplete information provided by the patient.
                    </p>

                    <h3>6. Intellectual Property</h3>
                    <p>
                        All educational materials, reports, advice transcripts, and media content provided on this website or during consultations are the intellectual property of Prof. Dr. Javed Altaf and cannot be reproduced or distributed without explicit written permission.
                    </p>

                    <h3>7. Governing Law</h3>
                    <p>
                        These terms shall be governed by and construed in accordance with the laws of Pakistan, under the jurisdiction of courts in Hyderabad, Sindh.
                    </p>

                    <h3>8. Amendments</h3>
                    <p>
                        We reserves the right to amend these Terms and Conditions at any time. Any changes will be posted on this page with an updated modification date.
                    </p>
                </div>
            </div>
            <style>{`
                .terms-page {
                    padding: 160px 0 80px;
                    min-height: 80vh;
                    background: var(--light-gray);
                }
                .terms-content {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }
                .terms-content h3 {
                    margin-top: 30px;
                    margin-bottom: 15px;
                    color: var(--primary-dark);
                    font-size: 1.3rem;
                    border-bottom: 1px solid var(--medium-gray);
                    padding-bottom: 8px;
                }
                .terms-content p {
                    line-height: 1.7;
                    color: var(--text-dark);
                    margin-bottom: 20px;
                }
                @media (max-width: 768px) {
                    .terms-page {
                        padding-top: 120px;
                    }
                    .terms-content {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default TermsAndConditions;
