import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiBookOpen, FiZap, FiX } from "react-icons/fi";
import "./ScheduleAnnouncementBar.scss";

const ScheduleAnnouncementBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  // Do not show on comic viewer page to preserve immersive reading experience
  if (location.pathname.startsWith("/viewer") || dismissed) {
    return null;
  }

  return (
    <div className="schedule-announcement-bar">
      <div className="schedule-inner">
        <div className="schedule-badge">
          <span className="pulse-dot"></span>
          <span className="badge-text">SCHEDULE</span>
        </div>

        <div className="schedule-content">
          <span className="schedule-item comic-item">
            <FiBookOpen className="schedule-icon comic-icon" />
            <strong className="highlight-text">🔥 JUST RELEASED:</strong> Karate King (कराटे किंग) Episode 1 is OUT NOW! Ep 2 next week.
          </span>
          <span className="schedule-divider">•</span>
          <span className="schedule-item news-item">
            <FiZap className="schedule-icon news-icon" />
            <strong className="highlight-text">Daily News &amp; Lore:</strong> Mon–Sun at 11:00 AM IST
          </span>
        </div>

        <div className="schedule-actions">
          <button 
            className="schedule-btn comic-btn" 
            onClick={() => navigate("/details/6a8fe2e6219290f7286b9b45-karate-king")}
            title="Read Karate King Episode 1"
            style={{ background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 100%)", color: "#fff", fontWeight: "700" }}
          >
            Read Karate King →
          </button>
          <button 
            className="schedule-btn news-btn" 
            onClick={() => navigate("/news")}
            title="Read Daily News"
          >
            Today's News
          </button>
          <button 
            className="schedule-close-btn" 
            onClick={() => setDismissed(true)} 
            aria-label="Dismiss announcement"
            title="Close banner"
          >
            <FiX />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAnnouncementBar;
