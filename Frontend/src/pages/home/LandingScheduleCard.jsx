import React from "react";
import { Link } from "react-router-dom";
import "./LandingScheduleCard.scss";

const LandingScheduleCard = () => {
  return (
    <div className="landing-schedule-subtle">
      <div className="schedule-subtle-inner">
        <div className="schedule-item">
          <span className="dot comic-dot"></span>
          <span className="label">🔥 Just Released:</span>
          <span className="time"><Link to="/viewer/6a8fe2e6219290f7286b9b45-karate-king" style={{ color: "#ff8c00", fontWeight: "700", textDecoration: "none" }}>Karate King Ep 1</Link> (Ep 2 next week)</span>
        </div>
        <div className="divider"></div>
        <div className="schedule-item">
          <span className="dot news-dot"></span>
          <span className="label">Daily News &amp; Lore:</span>
          <span className="time">Mon–Sun at 11:00 AM IST</span>
        </div>
      </div>
    </div>
  );
};

export default LandingScheduleCard;
