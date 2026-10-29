import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import Modal from "../../AboutCard/Model";
import RegisterComponent from "../credentials/RegisterComponent";
import "./LandingCtaBanner.scss";

const LandingCtaBanner = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        className={`lcb-root ${inView ? "lcb-visible" : ""}`}
        ref={sectionRef}
        aria-label="Join ZealPlane"
      >
        {/* halftone dot overlay */}
        <div className="lcb-halftone" aria-hidden="true" />

        {/* gradient sweep */}
        <div className="lcb-sweep" aria-hidden="true" />

        <div className="lcb-content">
          <h2 className="lcb-headline">
            Your next favorite comic is
            <br />
            <span className="lcb-headline-accent">one click away</span>
          </h2>
          <p className="lcb-subtext">
            Join thousands of readers and creators on India's freshest comic
            platform. No subscriptions, no paywalls — just great stories.
          </p>
          <button
            className="lcb-btn"
            onClick={() => setShowRegister(true)}
            id="final-cta-join"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
          >
            <span>Join ZealPlane — It's Free</span>
            <Sparkles size={16} />
          </button>
        </div>
      </section>

      <Modal show={showRegister} handleClose={() => setShowRegister(false)}>
        <RegisterComponent />
      </Modal>
    </>
  );
};

export default LandingCtaBanner;
