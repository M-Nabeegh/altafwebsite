import React, { useEffect } from 'react';
import CTAButton from '../components/CTAButton';
import { FaShareAlt, FaPlay, FaMicroscope, FaChild, FaNotesMedical, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import case2Img1 from '../assets/case2-img1.webp';
import case2Img2 from '../assets/case2-img2.webp';
import case2Img3 from '../assets/case2-img3.webp';
import case2Img4 from '../assets/case2-img4.webp';
import case3Img1 from '../assets/case3-img1.webp';
import case3Img2 from '../assets/case3-img2.webp';
import case3Img3 from '../assets/case3-img3.webp';
import case3Img4 from '../assets/case3-img4.webp';
import case3Img5 from '../assets/case3-img5.webp';
import case4Img1 from '../assets/case4-img1.webp';
import case4Img2 from '../assets/case4-img2.webp';
import case4Img3 from '../assets/case4-img3.webp';
import case4Img4 from '../assets/case4-img4.webp';
import case4Img5 from '../assets/case4-img5.webp';

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

    const clinicalCases = [
        {
            date: "May 2, 2025",
            title: 'Left Laparoscopic Pyeloplasty for PUJO',
            patient: "38-year-old gentleman.",
            history: "Left flank pain since 5 years.",
            diagnosis: 'Left Pelvi-ureteric junction obstruction (PUJO).',
            procedure: "Left laparoscopic pyeloplasty.",
            outcome: "Totally successful pioneering procedure breaking new ground in healthcare for our region. Patient discharged successfully.",
            quote: "Another medical milestone achieved! Thrilled to contribute to our continuous progress.",
            images: [case3Img1, case3Img2, case3Img3, case3Img4, case3Img5]
        },
        {
            date: "March 18, 2025",
            title: "Left Laparoscopic Assisted Mini PCNL (Totally Tubeless) in Ectopic Kidney",
            patient: "23-year-old gentleman.",
            history: "Intermittent pelvic pain for the past two years.",
            diagnosis: "Left ectopic kidney located in the pelvic region with a 2 cm radiolucent renal calculi.",
            procedure: "Left Laparoscopic Assisted Mini PCNL (Totally Tubeless).",
            outcome: "The procedure resulted in complete clearance, successfully resolving the issue. The patient's postoperative course was smooth and uneventful. After 24 hours of observation, he was discharged in stable condition.",
            quote: "Thanks to my team and supporting staff for making this procedure successful.",
            images: [case2Img1, case2Img2, case2Img3, case2Img4]
        },
        {
            date: "March 2024",
            title: "PCNL in Major Spine Deformity with Complete Clearance",
            patient: "Adult patient with significant spinal deformity.",
            history: "Presented with renal stones complicated by severe spinal curvature.",
            diagnosis: "Renal calculi in a patient with major spine deformity.",
            procedure: "Percutaneous Nephrolithotomy (PCNL).",
            outcome: "Successfully performed PCNL with complete clearance of stones despite the challenging anatomy due to spine deformity.",
            quote: "Alhumdulillah! Another complex case managed successfully with complete clearance.",
            images: [case4Img1, case4Img2, case4Img3, case4Img4, case4Img5]
        }
    ];

    const [selectedImage, setSelectedImage] = React.useState(null);

    const openImage = (img) => {
        setSelectedImage(img);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeImage = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };

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

            {/* SECTION 2: FEATURED HERO CASE (Elutax) */}
            <section className="hero-case-section section">
                <div className="container">
                    <div className="hero-case-card">
                        <div className="case-content">
                            <div className="badge-featured mb-3">
                                <FaCheckCircle className="mr-2" /> First-Ever in Pakistan
                            </div>
                            <div className="text-muted mb-2"><small>Performed on: July 29, 2025</small></div>
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

            {/* SECTION 2.5: RECENT CLINICAL SUCCESS STORIES */}
            <section className="clinical-cases-section section">
                <div className="container">
                    <div className="section-header text-center mb-5">
                        <h2>Recent Clinical Success Stories</h2>
                        <div className="separator-line mx-auto"></div>
                    </div>

                    {clinicalCases.map((item, index) => (
                        <div key={index} className="clinical-case-card fade-in mb-5">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="clinical-content">
                                        <div className="case-date mb-2"><FaNotesMedical className="mr-2" /> {item.date}</div>
                                        <h3>{item.title}</h3>
                                        <p className="lead-text mt-3">
                                            <strong>Patient:</strong> {item.patient}<br />
                                            <strong>History:</strong> {item.history}
                                        </p>
                                        <p>
                                            <strong>Diagnosis:</strong> {item.diagnosis}
                                        </p>
                                        <p>
                                            <strong>Procedure:</strong> {item.procedure}
                                        </p>
                                        <div className="outcome-box mt-4">
                                            <h5><FaCheckCircle className="text-success mr-2" /> Clinical Outcome</h5>
                                            <p className="mb-0">{item.outcome}</p>
                                        </div>
                                        <p className="mt-4 text-muted font-italic">
                                            "{item.quote}"
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="clinical-images-grid">
                                        {item.images.map((img, i) => (
                                            <div key={i} className="img-container" onClick={() => openImage(img)}>
                                                <img src={img} alt={`${item.title} Image ${i + 1}`} className="img-fluid rounded shadow-sm" loading="lazy" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* IMAGE LIGHTBOX MODAL */}
            {selectedImage && (
                <div className="lightbox-modal" onClick={closeImage}>
                    <div className="lightbox-content">
                        <img src={selectedImage} alt="Enlarged view" />
                        <button className="close-btn" onClick={closeImage}>&times;</button>
                    </div>
                </div>
            )}

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

            .clinical-cases-section {
                background: #f9f9f9;
            }
            .clinical-case-card {
                background: white;
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-md);
                padding: 40px;
                border: 1px solid var(--light-gray);
                margin-bottom: 60px; /* Increased spacing between cases */
            }
            .case-date {
                color: var(--accent-color);
                font-weight: 600;
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .clinical-content h3 {
                color: var(--primary-dark);
                margin-top: 10px;
                margin-bottom: 20px;
            }
            .lead-text {
                font-size: 1.1rem;
                color: var(--text-dark);
            }
            .outcome-box {
                background: #e6fffa;
                border-left: 4px solid #38b2ac;
                padding: 20px;
                border-radius: 4px;
            }
            .clinical-images-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            .clinical-images-grid .img-container {
                cursor: pointer;
                overflow: hidden;
                border-radius: 8px;
            }
            .clinical-images-grid img {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 8px;
                transition: transform 0.3s ease;
            }
            .clinical-images-grid img:hover {
                transform: scale(1.05);
            }

            /* Lightbox Modal */
            .lightbox-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            .lightbox-content img {
                max-width: 100%;
                max-height: 90vh;
                border-radius: 4px;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
            }
            .close-btn {
                position: absolute;
                top: -40px;
                right: -40px;
                background: transparent;
                border: none;
                color: white;
                font-size: 3rem;
                cursor: pointer;
                line-height: 1;
                transition: color 0.2s;
            }
            .close-btn:hover {
                color: var(--accent-color);
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
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

                .clinical-case-card {
                    padding: 20px;
                }
                .clinical-images-grid {
                    grid-template-columns: 1fr;
                    margin-top: 20px;
                }
                .clinical-images-grid img {
                    height: auto;
                }
                .close-btn {
                    top: -40px;
                    right: 0;
                }
            }
      `}</style>
        </div>
    );
};

export default PioneeredCasesPage;
