import React, { useState, useEffect } from 'react';
import { navLinks, doctorProfile } from '../data/content';
import CTAButton from './CTAButton';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsOpen(false);
    // If it's a hash link on the home page, we might need custom handling if we are already there
    // But standard anchor behavior usually works if IDs are present
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <h2>{doctorProfile.name}</h2>
          <span>{doctorProfile.designation}</span>
        </Link>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            <button className="close-menu-btn" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <ul>
            {navLinks.map((link) => {
              // Check if link is internal hash or external page
              const isHash = link.href.includes('#');
              // Logic: If we are not on home and link is hash, go to home+hash
              // If we are on home and link is hash, just hash (native behavior)

              // Simplified: Just use the href from content.js which is now absolute path or /#hash
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={location.pathname === link.href ? 'active-link' : ''}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="cta-desktop">
            <CTAButton text="Book Consultation" />
          </div>
          <button
            className="mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 20px 0;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.95); /* Always white background for readability */
          box-shadow: var(--shadow-sm); 
        }

        .header.scrolled {
          padding: 10px 0;
          backdrop-filter: blur(10px);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          /* Removed flex-wrap to prevent stacking */
        }

        .logo {
           flex-shrink: 0;
           margin-right: 20px;
        }

        .logo h2 {
          font-size: 1.2rem;
          margin-bottom: 0;
          color: var(--primary-dark);
          line-height: 1.2;
        }

        .logo span {
          display: block;
          font-size: 0.8rem;
          color: var(--text-light);
          font-weight: 400;
        }

        .nav-menu ul {
          display: flex;
          list-style: none;
          gap: 15px; /* Tighter gap */
        }

        .nav-menu a {
          text-decoration: none;
          color: var(--text-dark);
          font-weight: 500;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .nav-menu a:hover {
          color: var(--primary-color);
        }

        .cta-desktop {
          display: block;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--primary-dark);
        }
        
        .mobile-menu-header {
            display: none;
        }

        /* Increased breakpoint to switch to mobile menu sooner (before it breaks) */
        @media (max-width: 1250px) {
          .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            height: 100vh;
            background: white;
            padding: 80px 40px;
            transition: 0.3s ease-in-out;
            box-shadow: var(--shadow-xl);
          }

          .nav-menu.active {
            right: 0;
          }

          .nav-menu ul {
            flex-direction: column;
            gap: 20px;
          }

          .cta-desktop {
            display: none;
          }

          .mobile-toggle {
            display: block;
            z-index: 1001;
          }
          
          .mobile-menu-header {
             display: flex;
             justify-content: flex-end;
             margin-bottom: 20px;
          }

          .close-menu-btn {
             background: none;
             border: none;
             font-size: 1.8rem;
             color: var(--primary-dark);
             cursor: pointer;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
