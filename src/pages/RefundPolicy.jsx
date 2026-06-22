import React from 'react';
import SEO from '../components/SEO';

const RefundPolicy = () => {
    return (
        <div className="refund-page section fade-in">
            <SEO 
                title="Refund, Cancellation & Return Policy | Prof. Dr. Javed Altaf" 
                description="Refund, cancellation, and return policies for online urological consultations with Prof. Dr. Javed Altaf." 
                keywords="refund policy, return policy, cancel appointment, refund terms Dr Javed Altaf"
                url="https://www.javedaltaf.com/refund-policy"
            />
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="mb-5 text-center">Refund, Cancellation & Return Policy</h1>

                <div className="refund-content">
                    <h3>1. Cancellation and Refund Policy</h3>
                    <p>
                        We understand that schedules can change. If you need to cancel your scheduled online consultation, the following refund terms apply:
                    </p>
                    <ul>
                        <li><strong>Cancellations made more than 24 hours prior</strong> to the scheduled Saturday appointment are eligible for a <strong>100% full refund</strong> of the PKR 4,000 fee.</li>
                        <li><strong>Cancellations made less than 24 hours prior</strong> to the scheduled Saturday appointment or <strong>no-shows</strong> are <strong>non-refundable</strong>. However, at the doctor's discretion, you may request to reschedule the session to the following Saturday.</li>
                    </ul>

                    <h3>2. Rescheduling Policy</h3>
                    <p>
                        You can reschedule your online consultation slot before the appointment time without any penalty. Rescheduling requests can be made via email at <a href="mailto:javed_altafdr@yahoo.com" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>javed_altafdr@yahoo.com</a> or via phone/WhatsApp at <strong>0300-3068775</strong>.
                    </p>

                    <h3>3. Exceptional Circumstances</h3>
                    <p>
                        In the rare event that Prof. Dr. Javed Altaf is unable to attend the consultation due to an urgent surgery or a medical emergency, you will be notified immediately. In such cases, you will be offered:
                    </p>
                    <ol>
                        <li>An immediate rescheduling to the earliest available Saturday slot that suits your schedule.</li>
                        <li>A 100% full refund of the PKR 4,000 booking fee.</li>
                    </ol>

                    <h3>4. Refund Processing Time</h3>
                    <p>
                        Approved refunds will be processed back to the original payment method (e.g., credit card, bank transfer, mobile wallet) that was used during booking. Please allow <strong>5 to 7 working days</strong> for the refunded amount to reflect in your account, depending on your bank or payment gateway service provider.
                    </p>

                    <h3>5. Return Policy for Digital Services</h3>
                    <p>
                        Since the services provided are digital clinical consultations, once the consultation is conducted (either in full or in part), it is considered completed. No returns or refunds are applicable after a consultation has been held.
                    </p>

                    <h3>6. Contact for Refund Queries</h3>
                    <p>
                        For any cancellation, rescheduling, or refund requests, please reach out to us:
                        <br />
                        <strong>Email:</strong> javed_altafdr@yahoo.com
                        <br />
                        <strong>Phone / WhatsApp:</strong> 0300-3068775
                    </p>
                </div>
            </div>
            <style>{`
                .refund-page {
                    padding: 160px 0 80px;
                    min-height: 80vh;
                    background: var(--light-gray);
                }
                .refund-content {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }
                .refund-content h3 {
                    margin-top: 30px;
                    margin-bottom: 15px;
                    color: var(--primary-dark);
                    font-size: 1.3rem;
                    border-bottom: 1px solid var(--medium-gray);
                    padding-bottom: 8px;
                }
                .refund-content p, .refund-content ul, .refund-content ol {
                    line-height: 1.7;
                    color: var(--text-dark);
                    margin-bottom: 20px;
                }
                .refund-content ul, .refund-content ol {
                    padding-left: 20px;
                }
                .refund-content li {
                    margin-bottom: 10px;
                }
                @media (max-width: 768px) {
                    .refund-page {
                        padding-top: 120px;
                    }
                    .refund-content {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RefundPolicy;
