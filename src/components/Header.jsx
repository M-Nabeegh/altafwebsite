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

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/favicon-48.png" alt="Prof. Dr. Javed Altaf Logo" className="header-logo-img" width="48" height="48" fetchPriority="high" />
          <div className="logo-text">
            <h2>{doctorProfile.name}</h2>
            <span>{doctorProfile.designation}</span>
          </div>
        </Link>

        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <div className="mobile-menu-header">
            <button className="close-menu-btn" aria-label="Close mobile menu" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <ul>
            {navLinks.map((link) => {
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
            aria-label="Toggle mobile menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>


    </header>
  );
};

export default Header;
