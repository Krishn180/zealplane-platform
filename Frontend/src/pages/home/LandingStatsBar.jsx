import React, { useState, useEffect, useRef } from "react";
import { Zap, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import "./LandingStatsBar.scss";

const valuePillars = [
  {
    icon: <Zap size={26} className="pillar-icon zap" />,
    title: "100% Free",
    subtitle: "No paywalls or coin locks"
  },
  {
    icon: <Calendar size={26} className="pillar-icon calendar" />,
    title: "Regular Updates",
    subtitle: "Fresh chapters released regularly"
  },
  {
    icon: <ShieldCheck size={26} className="pillar-icon shield" />,
    title: "Zero Clutter",
    subtitle: "Distraction-free vertical reader"
  },
  {
    icon: <Sparkles size={26} className="pillar-icon spark" />,
    title: "Original Stories",
    subtitle: "Action, Dark Fantasy & Comedy"
  }
];

const LandingStatsBar = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`lsb-root ${inView ? "lsb-visible" : ""}`}
      ref={sectionRef}
      aria-label="Platform Highlights"
    >
      <div className="lsb-grid">
        {valuePillars.map((pillar, i) => (
          <div
            key={i}
            className="lsb-card"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <div className="lsb-icon-wrap">
              {pillar.icon}
            </div>
            <h3 className="lsb-title">{pillar.title}</h3>
            <p className="lsb-desc">{pillar.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingStatsBar;
