import React, { useState } from "react";
import "../AboutCard/NavbarStyle.css"; // Assuming the CSS file is named NavbarStyle.css
import logozp from "../assets/logoZP.png";
import Modal from "../AboutCard/Model";
import LoginComponent from "../pages/credentials/LoginComponent";
import RegisterComponent from "../pages/credentials/RegisterComponent";
import { Link } from "react-router-dom";

import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  return (
    <header className="nav-top">
      <div className="nav-container">
        <Link to="/" className="nav-logo-link" onClick={() => setMobileMenuOpen(false)}>
          <img src={logozp} alt="ZealPlane" className="nav-logo-img" />
          <span className="logo-text">
            ZEAL<span className="plane">PLANE</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <Link to="/manga-release-calendar" className="nav-link-tracker">
            <span className="tracker-icon">📅</span>
            <span className="tracker-text-full">Release Tracker</span>
            <span className="tracker-text-short">Tracker</span>
          </Link>
          <Link to="/news" className="nav-link-news">
            News
          </Link>
          <Link to="/tools/webtoon-slicer" className="nav-link-tools" style={{ color: "#f47521", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span>✂️</span> Slicer
          </Link>
          <div className="nav-lang-wrapper">
            <LanguageSwitcher variant="compact" />
          </div>
          <button onClick={handleLoginClick} className="btn-nav-login" type="button">
            Login
          </button>
          <button onClick={handleRegisterClick} className="btn-nav-join" type="button">
            <span className="join-text-full">Join ZealPlane</span>
            <span className="join-text-short">Join</span>
          </button>
        </div>

        {/* Mobile Header Controls */}
        <div className="nav-mobile-right">
          <button 
            onClick={handleRegisterClick} 
            className="btn-nav-join-mobile" 
            type="button"
          >
            Join
          </button>
          <button
            className={`nav-hamburger-btn ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer">
          <Link 
            to="/manga-release-calendar" 
            className="drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="drawer-icon">📅</span>
            <span>Manga Release Tracker</span>
          </Link>
          <Link 
            to="/news" 
            className="drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="drawer-icon">📰</span>
            <span>Chronicles &amp; Manga News</span>
          </Link>
          <Link 
            to="/tools/webtoon-slicer" 
            className="drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="drawer-icon">✂️</span>
            <span>Webtoon Slicer Tool</span>
          </Link>
          <Link 
            to="/features" 
            className="drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="drawer-icon">⚡</span>
            <span>Platform Features</span>
          </Link>
          <Link 
            to="/pricing" 
            className="drawer-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="drawer-icon">💎</span>
            <span>Free Pricing &amp; Model</span>
          </Link>
          <div className="drawer-divider"></div>
          <div className="drawer-lang-row">
            <span className="drawer-lang-label">Language:</span>
            <LanguageSwitcher variant="compact" />
          </div>
          <div className="drawer-actions">
            <button 
              onClick={() => { setMobileMenuOpen(false); handleLoginClick(); }} 
              className="drawer-btn-login"
              type="button"
            >
              Login
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); handleRegisterClick(); }} 
              className="drawer-btn-join"
              type="button"
            >
              Join ZealPlane
            </button>
          </div>
        </div>
      )}

      <Modal show={showLoginModal} handleClose={handleCloseLoginModal}>
        <LoginComponent />
      </Modal>
      <Modal show={showRegisterModal} handleClose={handleCloseRegisterModal}>
        <RegisterComponent />
      </Modal>
    </header>
  );
};

export default Navbar;
