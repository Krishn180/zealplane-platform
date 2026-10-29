import React from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import "./AmazonKindleCard.scss";

const GOD_COVER_URL = "https://res.cloudinary.com/datgyuhmy/image/upload/v1787747230/author_books/god_game_of_death_hindi_novel_cover.jpg";
const AMAZON_URL = "https://www.amazon.in/dp/B0D7367ZHM?tag=zealplane-21";

const AmazonKindleCard = ({ 
  comicName = "", 
  projectId = ""
}) => {
  const nameLow = (comicName || "").toLowerCase();
  
  // Show on all KARMA editions, Detective Hittu, and author thriller works
  const isTargetComic = 
    nameLow.includes("karma") || 
    nameLow.includes("hittu") || 
    nameLow.includes("detective") || 
    nameLow.includes("game of death") ||
    nameLow.includes("god —") ||
    nameLow.includes("god -");
  
  if (!isTargetComic) return null;

  const handleKindleClick = () => {
    // IMPORTANT: Fire analytics ASYNC — do not block or prevent default navigation
    try {
      const userId = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon_reader";
      // Ensure a valid 24-char ObjectId is sent so Mongoose trackBehavior doesn't fail
      const validProjectId = (projectId && projectId.length === 24) ? projectId : "6a60d6370cb3db69eafea318";
      fetch("/api/behavior/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          projectId: validProjectId,
          enquiryOpened: true,
          customAction: "amazon_god_hindi_novel_click"
        })
      }).catch(() => {}); // swallow errors — do NOT interfere with link
    } catch (_) {}
    // Let the browser handle the <a href> normally (target="_blank")
  };

  return (
    <div className="amazon-kindle-card">
      <div className="kindle-badge-row">
        <span className="kindle-badge">
          <Sparkles size={13} className="kindle-sparkle" />
          <span>Author's Official Hindi Novel</span>
        </span>
        <span className="kindle-format-pill">📱 Kindle &amp; Kindle Unlimited</span>
      </div>

      <div className="kindle-body">
        {/* Book Cover Thumbnail */}
        <div className="kindle-cover-wrapper">
          <img 
            src={GOD_COVER_URL} 
            alt="G.O.D - Game of Death Hindi novel by Krishna Kumar" 
            className="kindle-book-cover"
            loading="lazy"
          />
        </div>
        
        {/* Book Information with Contextual Hook & Curiosity Climax */}
        <div className="kindle-info">
          <h4 className="kindle-title">
            G.O.D — गेम ऑफ डेथ (Game of Death)
          </h4>
          <span className="kindle-subtitle">
            A Hindi Supernatural Thriller · by <strong>Krishna Kumar</strong>
          </span>
          <p className="kindle-description">
            If you enjoyed the psychological suspense in this chapter, dive into Krishna Kumar's official Hindi novel <strong>G.O.D</strong>. <em>What happens when the ultimate rules of death are broken? Read the final 12 pages that define the saga.</em>
          </p>
          {/* Price Anchoring & Choice Architecture */}
          <div className="kindle-price-anchoring" style={{ marginTop: "8px", fontSize: "12px", color: "#94a3b8", display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ textDecoration: "line-through", color: "#64748b" }}>Paperback: ₹499</span>
            <span style={{ color: "#4ade80", fontWeight: "700", background: "rgba(74, 222, 128, 0.1)", padding: "2px 8px", borderRadius: "4px" }}>
              Kindle Edition: ₹0 (Kindle Unlimited)
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="kindle-cta-wrapper">
          <a
            href={AMAZON_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleKindleClick}
            className="kindle-cta-btn"
          >
            <span>Read Instantly on Kindle →</span>
            <ExternalLink size={15} />
          </a>
          <span className="kindle-free-text">✓ Free with Kindle Unlimited</span>
        </div>
      </div>
    </div>
  );
};

export default AmazonKindleCard;
