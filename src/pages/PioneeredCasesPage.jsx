import React, { useEffect } from 'react';
import CTAButton from '../components/CTAButton';
import { FaShareAlt, FaPlay, FaMicroscope, FaChild, FaNotesMedical, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PioneeredCasesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Pioneer Cases Data (Scalable)
    const landmarkCases = [
        {
            title: "Advanced Endourology Innovation",
            subtitle: "Complex Ureteral Stricture Management",
            badge: "Among the first in Pakistan",
            desc: "Introduction of novel endourological techniques for complex ureteral strictures using minimally invasive technology.",
            year: "2024",
            icon: <FaMicroscope />
        },
        {
            title: "Complex Stone Disease Management",
            subtitle: "Mini-PCNL & RIRS Strategies",
            badge: "Pioneered Strategy",
            desc: "Pioneered advanced Mini-PCNL and RIRS strategies for large and recurrent renal stones with high stone-free rates.",
            year: "2023",
            icon: <FaNotesMedical />
        },
        {
            title: "Pediatric Urology Breakthroughs",
            subtitle: "Minimally Invasive Pediatric Care",
            badge: "National Leader",
            desc: "Safe application of minimally invasive techniques in pediatric stone disease and congenital anomalies.",
            year: "2022",
            icon: <FaChild />
        }
    ];

    return (
        <div className="pioneered-page">

            {/* SECTION 1: PAGE INTRO */}
            <section className="intro-section bg-dark text-white">
                <div className="container text-center">
                    <div className="intro-badge mb-3">Innovation in Urology</div>
                    <h1 className="display-4 font-weight-bold mb-4">Pioneered Urological Procedures in Pakistan</h1>
                    <p className="lead mx-auto" style={{ maxWidth: '800px', opacity: 0.9, margin: '0 auto' }}>
                        Prof. Dr. Javed Altaf has been at the forefront of introducing advanced and innovative urological procedures in Pakistan. These landmark cases reflect his commitment to adopting cutting-edge technology, improving patient outcomes, and advancing urological care nationwide.
                    </p>
                </div>
            </section>

            {/* SECTION 2: FEATURED HERO CASE */}
            <section className="hero-case-section section">
                <div className="container">
                    <div className="hero-case-card">
                        <div className="case-content">
                            <div className="badge-featured mb-3">
                                <FaCheckCircle className="mr-2" /> First-Ever in Pakistan
                            </div>
                            <h2>First-Ever Use of Drug-Coated Balloon Catheter (Elutax) for Ureteral Stricture in Pakistan</h2>

                            <div className="separator-line my-4"></div>

                            <p className="case-text">
                                Alhamdulillah, Prof. Dr. Javed Altaf had the privilege of performing the <strong>first-ever urological procedure in Pakistan</strong> for the treatment of ureteral stricture using a drug-coated balloon catheter (Elutax).
                            </p>
                            <p className="case-text">
                                This groundbreaking procedure represents a significant advancement in minimally invasive urology, offering improved outcomes with reduced recurrence rates.
                            </p>
                            <p className="case-text">
                                He is sincerely thankful to <strong>Allmed Solutions</strong> for introducing this advanced technology to Pakistan’s healthcare system.
                            </p>
                            <p className="case-text quote-text">
                                "A proud milestone achieved with gratitude to Almighty Allah and all colleagues who made this possible."
                            </p>
                        </div>

                        <div className="case-media">
                            <div className="video-wrapper">
                                {/* Overlay for tap-to-play feel if needed, but standard controls work well properly */}
                                <div className="player-container">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/cyq94sZZG2w?si=GEXdyW7rpsnbFLUx"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        style={{ position: 'absolute', top: 0, left: 0 }}
                                    ></iframe>
                                </div>
                                <div className="video-caption">
                                    <FaPlay className="icon-tiny" /> Landmark procedure performed for the first time in Pakistan
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: PIONEERED CASES GRID */}
            <section className="cases-grid-section section bg-light">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <h2>Selected Landmark & Innovative Procedures</h2>
                        <p className="text-muted">Innovations that define the future of urology</p>
                    </div>

                    <div className="cases-grid">
                        {landmarkCases.map((item, index) => (
                            <div key={index} className="case-card-item fade-in">
                                <div className="case-icon-box">{item.icon}</div>
                                <div className="case-year">{item.year}</div>
                                <div className="case-badge">{item.badge}</div>
                                <h3>{item.title}</h3>
                                <h4 className="case-subtitle">{item.subtitle}</h4>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: WHY IT MATTERS (TRUST) */}
            <section className="trust-section section">
                <div className="container text-center">
                    <div className="trust-content mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="mb-4">Why Pioneered Procedures Matter</h2>
                        <div className="trust-text-box">
                            <p>
                                Pioneered procedures demonstrate not only surgical expertise, but also the ability to responsibly adopt new medical technologies. These cases highlight Prof. Dr. Javed Altaf’s role as a leader in innovation, education, and evidence-based advancement of urological care in Pakistan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .bg-dark { background-color: var(--primary-dark); }
        .bg-light { background-color: var(--secondary-color); }
        .text-white { color: white !important; }
        .text-white-50 { color: rgba(255,255,255,0.7) !important; }

        .intro-section { padding: 80px 0; }
        .intro-badge { 
            display: inline-block; 
            background: rgba(255,255,255,0.1); 
            padding: 6px 16px; 
            border-radius: 50px; 
            font-weight: 600; 
            font-size: 0.9rem;
            color: var(--accent-color);
        }

        /* Hero Case Card */
        .hero-case-card {
            background: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            border: 1px solid var(--light-gray);
        }

        .case-content {
            padding: 40px;
        }

        .badge-featured {
            background: #eefdf5;
            color: #2e7d32;
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.9rem;
        }

        .case-content h2 {
            font-size: 1.8rem;
            line-height: 1.3;
            color: var(--primary-dark);
        }

        .separator-line {
            height: 4px;
            width: 60px;
            background: var(--accent-color);
            border-radius: 2px;
        }

        .case-text {
            font-size: 1.05rem;
            line-height: 1.7;
            color: var(--text-dark);
            margin-bottom: 20px;
        }

        .quote-text {
            font-style: italic;
            color: var(--text-light);
            border-left: 3px solid var(--accent-color);
            padding-left: 15px;
        }

        .case-media {
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            min-height: 400px;
        }

        .video-wrapper {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .player-container {
            flex: 1;
            position: relative;
        }

        .video-caption {
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 15px;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
            text-align: center;
            justify-content: center;
        }

        /* Cases Grid */
        .cases-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
        }

        .case-card-item {
            background: white;
            padding: 30px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--light-gray);
            position: relative;
            transition: transform 0.3s ease;
        }

        .case-card-item:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
            border-color: var(--primary-color);
        }

        .case-icon-box {
            font-size: 2rem;
            color: var(--accent-color);
            margin-bottom: 20px;
        }

        .case-year {
            position: absolute;
            top: 20px;
            right: 20px;
            font-weight: 700;
            opacity: 0.1;
            font-size: 3rem;
            color: var(--primary-dark);
            line-height: 1;
        }

        .case-badge {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--primary-color);
            font-weight: 700;
            margin-bottom: 10px;
        }

        .case-card-item h3 {
            font-size: 1.2rem;
            margin-bottom: 5px;
            color: var(--primary-dark);
        }

        .case-subtitle {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-light);
            margin-bottom: 15px;
        }
        
        /* Trust Section */
        .trust-text-box {
            background: white;
            padding: 40px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--light-gray);
            box-shadow: var(--shadow-sm);
            font-size: 1.15rem;
            line-height: 1.8;
            color: var(--text-dark);
        }

        @media (max-width: 900px) {
            .hero-case-card {
                grid-template-columns: 1fr;
                border: none;
                box-shadow: none;
                background: transparent;
            }
            
            .case-content {
                padding: 0 0 30px 0;
            }
            
            .case-media {
                border-radius: var(--radius-lg);
                overflow: hidden;
                min-height: 250px;
            }
            
            .cases-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
        </div>
    );
};

export default PioneeredCasesPage;
