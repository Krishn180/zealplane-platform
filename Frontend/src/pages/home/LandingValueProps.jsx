import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Zap,
  MessageCircle,
  Gamepad2,
  Paintbrush,
  BarChart2,
  Coins,
  Globe
} from "lucide-react";
import Modal from "../../AboutCard/Model";
import RegisterComponent from "../credentials/RegisterComponent";
import "./LandingValueProps.scss";

const readerFeatures = [
  { icon: <BookOpen size={24} />, title: "Free Original Comics", desc: "Access hundreds of indie comics — dark fantasy, action, romance, sci-fi — all free to read." },
  { icon: <Zap size={24} />, title: "New Chapters Weekly", desc: "Fresh drops every week from active creators who actually ship." },
  { icon: <MessageCircle size={24} />, title: "Creator Q&As & Forums", desc: "Discuss theories, ask creators questions, and shape storylines." },
  { icon: <Gamepad2 size={24} />, title: "Earn Reader XP & Badges", desc: "Read, comment, share — level up your profile and unlock rewards." },
];

const creatorFeatures = [
  { icon: <Paintbrush size={24} />, title: "Publish in Minutes", desc: "Upload your panels, set your cover, hit publish. No gatekeepers." },
  { icon: <BarChart2 size={24} />, title: "Real Reader Analytics", desc: "See who's reading, where they drop off, and what gets shared." },
  { icon: <Coins size={24} />, title: "Monetize Your Art", desc: "Unlock your premium tier at ₹1 — keep the majority of your revenue." },
  { icon: <Globe size={24} />, title: "10,000+ Active Readers", desc: "Your comic lands in front of a verified, engaged audience from day one." },
];

const LandingValueProps = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        className={`lvp-root ${inView ? "lvp-visible" : ""}`}
        ref={sectionRef}
        aria-label="Why ZealPlane"
      >
        <div className="lvp-header">
          <h2 className="lvp-title">Built for Both Sides of the Story</h2>
          <p className="lvp-subtitle">
            Whether you devour panels or draw them — ZealPlane is your platform.
          </p>
        </div>

        <div className="lvp-columns">
          {/* ── reader column ── */}
          <div className="lvp-col lvp-col-reader">
            <div className="lvp-col-badge">For Readers</div>
            <div className="lvp-features">
              {readerFeatures.map((f, i) => (
                <div
                  key={i}
                  className="lvp-feature"
                  style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
                >
                  <span className="lvp-feature-icon">{f.icon}</span>
                  <div>
                    <h4 className="lvp-feature-title">{f.title}</h4>
                    <p className="lvp-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="lvp-cta lvp-cta-reader"
              onClick={() => navigate("/home")}
            >
              Explore Comics →
            </button>
          </div>

          {/* ── divider ── */}
          <div className="lvp-divider">
            <div className="lvp-divider-line" />
            <div className="lvp-divider-logo">
              <Zap size={18} fill="#ff6600" color="#ff6600" />
            </div>
            <div className="lvp-divider-line" />
          </div>

          {/* ── creator column ── */}
          <div className="lvp-col lvp-col-creator">
            <div className="lvp-col-badge lvp-col-badge-creator">For Creators</div>
            <div className="lvp-features">
              {creatorFeatures.map((f, i) => (
                <div
                  key={i}
                  className="lvp-feature"
                  style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
                >
                  <span className="lvp-feature-icon">{f.icon}</span>
                  <div>
                    <h4 className="lvp-feature-title">{f.title}</h4>
                    <p className="lvp-feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="lvp-cta lvp-cta-creator"
              onClick={() => setShowRegister(true)}
            >
              Start Publishing →
            </button>
          </div>
        </div>
      </section>

      <Modal show={showRegister} handleClose={() => setShowRegister(false)}>
        <RegisterComponent />
      </Modal>
    </>
  );
};

export default LandingValueProps;
