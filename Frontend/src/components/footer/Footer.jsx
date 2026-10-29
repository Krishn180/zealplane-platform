import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import LogoImage from "../../assets/logoZP.png";
import "./style.scss";

const Footer = ({ id }) => {
  const iconSize = 22;

  return (
    <footer className="footer" id={id || "site-footer"}>
      <div className="footer-container">
        {/* Left: Logo and Brand */}
        <div className="footer-brand">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <img src={LogoImage} alt="ZealPlane Logo" className="logo" />
            <span
              className="brand-name"
              style={{ color: "red", fontWeight: "900", fontSize: "18px" }}
            >
              ZEAL<span className="plane">PLANE</span>
            </span>
          </Link>
        </div>

        {/* Center: Legal & Editorial Links + Social */}
        <div className="middle">
          <nav className="footer-links" aria-label="Footer Navigation">
            <Link to="/about">About Us</Link>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/terms-of-use">Terms of Use</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/news">Anime & Manga News</Link>
            <Link to="/manga-release-calendar">Release Calendar</Link>
            <Link to="/tools/webtoon-slicer" style={{ color: "#f47521", fontWeight: "600" }}>
              ✂️ Webtoon Slicer
            </Link>
            <Link to="/faq">FAQ</Link>
          </nav>

          <div className="footer-socials" aria-label="Social Media">
            <a
              href="https://x.com/plane38843"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon twitter"
              aria-label="ZealPlane on X (Twitter)"
            >
              <FaTwitter size={iconSize} />
            </a>
            <a
              href="https://www.instagram.com/zealplane?igsh=MXI4OHRnMDUxdHI3Yw=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon instagram"
              style={{ color: "#E1306C" }}
              aria-label="ZealPlane on Instagram"
            >
              <FaInstagram size={iconSize} />
            </a>
            <a
              href="https://www.facebook.com/groups/683526374340078/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon facebook"
              aria-label="ZealPlane Facebook Community"
            >
              <FaFacebookF size={iconSize} />
            </a>
            <a
              href="https://www.linkedin.com/company/zealplane"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon linkedin"
              aria-label="ZealPlane LinkedIn"
            >
              <FaLinkedin size={iconSize} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p
          className="footer-amazon-disclaimer"
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            maxWidth: "850px",
            margin: "0 auto 8px auto",
            textAlign: "center",
            lineHeight: "1.4",
            padding: "0 16px",
          }}
        >
          ZealPlane is a digital comic and pop-culture publishing platform. We participate in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.in and Amazon.com.
        </p>
        <p>© {new Date().getFullYear()} ZealPlane. All rights reserved. Registered Indian Digital Comic & Media Platform.</p>
      </div>
    </footer>
  );
};

export default Footer;



