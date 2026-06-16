import React from 'react';
import SEO from '../components/SEO';

const ShippingPolicy = () => {
    return (
        <div className="shipping-page section fade-in">
            <SEO 
                title="Shipping & Delivery Policy | Prof. Dr. Javed Altaf" 
                description="Shipping and delivery terms for online medical consultations with Prof. Dr. Javed Altaf." 
                keywords="shipping policy, delivery policy, service delivery, online consultation delivery"
                url="https://www.javedaltaf.com/shipping-policy"
            />
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="mb-5 text-center">Shipping & Delivery Policy</h1>

                <div className="shipping-content">
                    <h3>1. Shipping of Physical Goods</h3>
                    <p>
                        Prof. Dr. Javed Altaf offers professional clinical services, online video/audio consultations, and second opinion reports. 
                        <strong> We do not sell or ship any physical goods or products</strong> through this website. Consequently, no physical shipping, delivery, or logistics services are provided, and no shipping charges apply.
                    </p>

                    <h3>2. Delivery of Digital Services</h3>
                    <p>
                        All services purchased on this website (such as online consultation bookings) are delivered digitally:
                    </p>
                    <ul>
                        <li><strong>Booking Confirmation:</strong> A booking confirmation email and/or WhatsApp message is sent immediately upon successful payment confirmation.</li>
                        <li><strong>Consultation Link:</strong> The secure video or audio call link for the online consultation will be sent to the contact details (email or phone number) provided by you during the booking process at least **2 hours prior** to your scheduled Saturday appointment slot.</li>
                    </ul>

                    <h3>3. Delivery Failures and Technical Issues</h3>
                    <p>
                        If you do not receive your confirmation details or the video link within the specified timeframe, please contact us immediately:
                        <br />
                        <strong>Email:</strong> javed_altafdr@yahoo.com
                        <br />
                        <strong>Phone / WhatsApp:</strong> 0300-3068775
                    </p>
                </div>
            </div>
            <style jsx>{`
                .shipping-page {
                    padding: 160px 0 80px;
                    min-height: 80vh;
                    background: var(--light-gray);
                }
                .shipping-content {
                    background: white;
                    padding: 40px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                }
                .shipping-content h3 {
                    margin-top: 30px;
                    margin-bottom: 15px;
                    color: var(--primary-dark);
                    font-size: 1.3rem;
                    border-bottom: 1px solid var(--medium-gray);
                    padding-bottom: 8px;
                }
                .shipping-content p, .shipping-content ul {
                    line-height: 1.7;
                    color: var(--text-dark);
                    margin-bottom: 20px;
                }
                .shipping-content ul {
                    padding-left: 20px;
                }
                .shipping-content li {
                    margin-bottom: 10px;
                }
                @media (max-width: 768px) {
                    .shipping-page {
                        padding-top: 120px;
                    }
                    .shipping-content {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ShippingPolicy;
