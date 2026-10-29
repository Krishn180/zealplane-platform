import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Flame, Award, BookOpen, PenTool, Sparkles } from "lucide-react";
import "./HomeHubBanner.scss";

const HomeHubBanner = ({ userDetails, userId }) => {
  const navigate = useNavigate();

  const displayLevel = userDetails?.level?.current || userDetails?.level || 1;
  const xpPoints = userDetails?.points || 0;
  const dailyStreak = userDetails?.dailyLoginStreak || 0;
  const targetXp = 500; // Next level XP milestone
  const progressPercent = Math.min((xpPoints / targetXp) * 100, 100);

  const handlePublishClick = () => {
    if (userId) {
      navigate(`/profile/${userId}`, { state: { openAddProject: true } });
    } else {
      navigate("/login");
    }
  };

  const handleScrollToFeed = () => {
    const feedElement = document.querySelector(".carouselSection");
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-hub-banner">
      <div className="home-hub-overlay" />
      <div className="home-hub-content">
        
        {/* Welcome Section */}
        <div className="home-hub-welcome">
          <div className="welcome-avatar-wrapper">
            {userDetails?.profilePic ? (
              <img 
                src={userDetails.profilePic} 
                alt="Avatar" 
                className="welcome-avatar" 
              />
            ) : (
              <div className="welcome-avatar-placeholder">
                {userDetails?.fullName?.charAt(0) || "U"}
              </div>
            )}
            <span className="welcome-level-badge">LVL {displayLevel}</span>
          </div>
          
          <div className="welcome-text">
            <h2 className="welcome-title">
              Welcome back, <span className="highlight">{userDetails?.fullName || userDetails?.username || "Reader"}</span>!
            </h2>
            <p className="welcome-subtitle">
              Ready to explore India's freshest indie stories, or publish your next masterpiece?
            </p>
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="home-hub-gamification">
          <div className="gamification-card">
            <div className="card-icon-box streak">
              <Flame size={24} />
            </div>
            <div className="card-info">
              <span className="info-val">{dailyStreak} Days</span>
              <span className="info-lbl">Daily Streak</span>
            </div>
          </div>

          <div className="gamification-card">
            <div className="card-icon-box points">
              <Award size={24} />
            </div>
            <div className="card-info">
              <span className="info-val">{xpPoints} XP</span>
              <span className="info-lbl">Total Experience</span>
            </div>
          </div>

          <div className="gamification-card">
            <div className="card-icon-box tier">
              <Trophy size={24} />
            </div>
            <div className="card-info">
              <span className="info-val">Tier {displayLevel >= 5 ? "Legend" : displayLevel >= 3 ? "Elite" : "Novice"}</span>
              <span className="info-lbl">Creator Status</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="home-hub-progress-section">
          <div className="progress-labels">
            <span>Level {displayLevel} Progress</span>
            <span className="xp-details">{xpPoints} / {targetXp} XP</span>
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dual Call to Actions */}
        <div className="home-hub-ctas">
          <button className="hub-btn hub-btn-primary" onClick={handlePublishClick}>
            <PenTool size={18} />
            <span>Publish Your Comic</span>
            <Sparkles size={14} className="sparkle-icon" />
          </button>
          
          <button className="hub-btn hub-btn-secondary" onClick={handleScrollToFeed}>
            <BookOpen size={18} />
            <span>Explore Comics</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default HomeHubBanner;
