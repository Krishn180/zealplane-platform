import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, X } from "lucide-react";

const ContinueReadingBanner = () => {
  const [lastRead, setLastRead] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("zp_dismiss_continue")) {
        setDismissed(true);
        return;
      }
      const raw = localStorage.getItem("zp_last_read");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.url || parsed.projectId) && parsed.title) {
          // Format relative time
          const hoursAgo = Math.floor((Date.now() - (parsed.timestamp || Date.now())) / (1000 * 60 * 60));
          const timeLabel = hoursAgo < 1 ? "Just now" : (hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`);
          setLastRead({ ...parsed, timeLabel });
        }
      }
    } catch (_) {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("zp_dismiss_continue", "true");
    } catch (_) {}
  };

  if (!lastRead || dismissed) return null;

  const targetUrl = lastRead.url || `/viewer/${lastRead.projectSlug || lastRead.projectId}`;

  return (
    <div
      className="zp-continue-reading-banner"
      style={{
        maxWidth: "1200px",
        margin: "14px auto 0 auto",
        padding: "0 20px",
        position: "relative",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          background: "linear-gradient(135deg, rgba(255, 69, 0, 0.12) 0%, rgba(37, 99, 235, 0.15) 100%)",
          border: "1px solid rgba(255, 140, 0, 0.35)",
          borderRadius: "14px",
          padding: "12px 18px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: "0 2px 10px rgba(255, 69, 0, 0.4)",
            }}
          >
            <BookOpen size={20} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#ff8c00",
                }}
              >
                Continue Reading
              </span>
              {lastRead.timeLabel && (
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  • {lastRead.timeLabel}
                </span>
              )}
            </div>
            <h4
              style={{
                margin: "2px 0 0 0",
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#f8fafc",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {lastRead.title}
            </h4>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            to={targetUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "13px",
              padding: "8px 18px",
              borderRadius: "20px",
              textDecoration: "none",
              boxShadow: "0 3px 12px rgba(255, 69, 0, 0.35)",
              transition: "transform 0.15s ease",
            }}
          >
            <span>Resume Story</span>
            <ArrowRight size={15} />
          </Link>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueReadingBanner;
