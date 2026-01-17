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


    </header>
  );
};

export default Header;
