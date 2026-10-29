import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, BookOpen, Palette } from "lucide-react";
import Modal from "../../AboutCard/Model";
import RegisterComponent from "../credentials/RegisterComponent";
import "./LandingCinematicHero.scss";

import hero1 from "../../assets/dehek-eng.jpg";
import hero2 from "../../assets/sando.jpg";
import hero3 from "../../assets/aghori9.jpg";
import hero4 from "../../assets/chullu.jpg";
import hero5 from "../../assets/gost1.jpg";
import hero6 from "../../assets/heroimge.jpg";
import hero7 from "../../assets/landingimage.jpg";

const images = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

const taglines = [
  "10,000+ readers waiting for your story",
  "Zero algorithm gatekeeping",
  "Your art, your rules",
  "India's freshest comic platform",
  "Publish today, get readers tonight",
];

const LandingCinematicHero = () => {
  const navigate = useNavigate();
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);

  // Rotate taglines
  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIdx((p) => (p + 1) % taglines.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // Trigger entrance animation
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section
        className={`lch-root ${loaded ? "lch-loaded" : ""}`}
        ref={sectionRef}
        aria-label="ZealPlane Hero Section"
      >
        {/* ── animated comic mosaic background ── */}
        <div className="lch-mosaic" aria-hidden="true">
          {images.map((src, i) => (
            <div key={i} className={`lch-tile lch-tile-${i}`}>
              <img src={src} alt="" loading="lazy" decoding="async" fetchpriority="low" draggable={false} />
            </div>
          ))}
          <div className="lch-mosaic-overlay" />
        </div>

        {/* ── halftone comic texture overlay ── */}
        <div className="lch-halftone" aria-hidden="true" />

        {/* ── main content ── */}
        <div className="lch-content">
          <div className="lch-badge">
            <Zap size={13} style={{ marginRight: "6px", display: "inline-block", verticalAlign: "middle" }} />
            India's #1 Indie Comic Platform
          </div>

          <h1 className="lch-headline">
            Where Indie Comics
            <br />
            <span className="lch-headline-accent">Come Alive</span>
          </h1>

          <p className="lch-subtext">
            Discover bold stories from independent creators, or publish your own
            and reach thousands of readers — no gatekeepers, no algorithms,
            just pure storytelling.
          </p>

          {/* ── dual CTAs ── */}
          <div className="lch-ctas">
            <button
              className="lch-btn lch-btn-primary"
              onClick={() => navigate("/home")}
              id="hero-cta-read"
            >
              <BookOpen size={20} />
              Dive Into Comics
            </button>
            <button
              className="lch-btn lch-btn-secondary"
              onClick={() => setShowRegister(true)}
              id="hero-cta-publish"
            >
              <Palette size={20} />
              Start Publishing
            </button>
          </div>

          {/* ── rotating speech bubble ── */}
          <div className="lch-speech" aria-live="polite">
            <div className="lch-speech-tail" />
            <span key={taglineIdx} className="lch-speech-text">
              {taglines[taglineIdx]}
            </span>
          </div>
        </div>

        {/* ── scroll indicator ── */}
        <div className="lch-scroll-hint" aria-hidden="true">
          <div className="lch-scroll-mouse">
            <div className="lch-scroll-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Register modal */}
      <Modal show={showRegister} handleClose={() => setShowRegister(false)}>
        <RegisterComponent />
      </Modal>
    </>
  );
};

export default LandingCinematicHero;
