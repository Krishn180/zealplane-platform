import React from "react";
import { MessageSquare, Flame, Sparkles, PenTool, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ForumTavernBanner.scss";

const ForumTavernBanner = ({ activeFilter, setActiveFilter }) => {
  const navigate = useNavigate();

  const filterTabs = [
    { id: "all", label: "🔥 All Discussions", icon: Flame },
    { id: "theories", label: "🧠 Theories & Lore", icon: Sparkles },
    { id: "art", label: "🎨 Fan Art & Sketches", icon: PenTool },
    { id: "general", label: "💬 General Chat", icon: MessageSquare },
  ];

  return (
    <div className="forum-tavern-banner">
      <div className="banner-glow-bg" />
      
      <div className="banner-top-row">
        <div className="banner-info">
          <div className="banner-badge">
            <span className="live-dot" />
            <span>COMMUNITY FORUM</span>
          </div>
          <h1 className="banner-title">Creator &amp; Reader Discussions</h1>
          <p className="banner-subtitle">
            Debate anime theories, share indie comic art, and connect with fellow creators on ZealPlane.
          </p>
        </div>

        <button 
          className="create-thread-hero-btn"
          onClick={() => navigate("/forum/create-post")}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Discussion</span>
        </button>
      </div>

      {/* Clean Category Filter Tabs */}
      <div className="forum-filter-tabs">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              className={`filter-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveFilter && setActiveFilter(tab.id)}
            >
              <Icon size={15} className="tab-icon" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ForumTavernBanner;
