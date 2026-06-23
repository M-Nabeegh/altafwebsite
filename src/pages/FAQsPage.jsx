import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { doctorProfile } from '../data/content';

const FAQsPage = () => {
    const faqData = [
        {
            question: "How do I book an online consultation?",
            answer: "You can book an online consultation directly through this website. Click the 'Book Consultation' button, choose an available Saturday time slot, enter the patient details, and complete payment to secure the slot. Keep any relevant medical reports with you in case the doctor asks to review them during the call; no upload is required."
        },
        {
            question: "What is the consultation fee?",
            answer: "The consultation fee is PKR 4,000 for a standard 15-minute WhatsApp video consultation with Prof. Dr. Javed Altaf. There are no hidden charges or extra administration fees."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept secure credit and debit card payments through our online payment service."
        },
        {
            question: "How will the WhatsApp consultation start?",
            answer: "Please be available on the WhatsApp number entered during booking. Prof. Dr. Javed Altaf will start the WhatsApp video call approximately 2 minutes before your scheduled time."
        },
        {
            question: "What is your cancellation and refund policy?",
            answer: "You can cancel your appointment up to 24 hours prior to the scheduled Saturday session for a 100% refund. Cancellations made within 24 hours of the appointment or no-shows are non-refundable, but you can request to reschedule."
        },
        {
            question: "Can I reschedule my appointment?",
            answer: `Yes, you can reschedule your appointment before the scheduled session time by emailing us at ${doctorProfile.email} or contacting support via phone/WhatsApp at ${doctorProfile.supportPhone}.`
        },
        {
            question: "Where is the physical clinic located?",
            answer: "Prof. Dr. Javed Altaf's clinic is located at Shaikh Diagnostic Center, Shop No. 12, Doctors Ln, near National saving centre, Soldier Bazaar Doctors Colony, Hyderabad, 71000."
        }
    ];

    return (
        <div className="faq-page section fade-in">
            <SEO 
                title="Frequently Asked Questions (FAQs) | Prof. Dr. Javed Altaf" 
                description="Find answers to common questions about booking appointments, consultation fees, and policies." 
                keywords="frequently asked questions, FAQ urologist Hyderabad, Dr Javed Altaf FAQs"
                url="https://www.javedaltaf.com/faq"
            />
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 className="mb-5 text-center">Frequently Asked Questions (FAQs)</h1>

                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-card">
                            <h3>{faq.question}</h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .faq-page {
                    padding: 160px 0 80px;
                    min-height: 80vh;
                    background: var(--light-gray);
                }
                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }
                .faq-card {
                    background: white;
                    padding: 30px;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-sm);
                }
                .faq-card h3 {
                    color: var(--primary-dark);
                    font-size: 1.2rem;
                    margin-bottom: 12px;
                    border-left: 4px solid var(--primary-color);
                    padding-left: 15px;
                }
                .faq-card p {
                    line-height: 1.6;
                    color: var(--text-dark);
                    margin: 0;
                    padding-left: 19px;
                }
                @media (max-width: 768px) {
                    .faq-page {
                        padding-top: 120px;
                    }
                    .faq-card {
                        padding: 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FAQsPage;
