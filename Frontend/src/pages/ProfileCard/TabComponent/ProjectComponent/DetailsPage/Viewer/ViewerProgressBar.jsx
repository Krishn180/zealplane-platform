import React from "react";

/**
 * ViewerProgressBar
 *
 * A sticky top-of-screen reading progress indicator.
 * Shows a fill bar (0–100%) + a "Page X of Y" counter.
 *
 * The Zeigarnik Effect: once a reader sees they're 60% through a chapter,
 * their brain registers an unfinished task and compels them to complete it.
 *
 * Props:
 *   progressPercentage {number} 0–100
 *   currentPage       {number} 0-indexed current page
 *   totalPages        {number} total images in the chapter
 */
const ViewerProgressBar = ({ progressPercentage = 0, currentPage = 0, totalPages = 0 }) => {
  const pct = Math.min(100, Math.max(0, progressPercentage));
  const displayPage = totalPages > 0 ? currentPage + 1 : 0;

  return (
    <div
      className="vp-progress-bar"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Reading progress: page ${displayPage} of ${totalPages}`}
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        width: "100%",
        background: "rgba(13, 13, 20, 0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255, 69, 0, 0.2)",
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* Fill track */}
      <div
        style={{
          flex: 1,
          height: "5px",
          borderRadius: "99px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            borderRadius: "99px",
            background: "linear-gradient(90deg, #ff4500, #ff8c00)",
            transition: "width 0.3s ease",
            boxShadow: pct > 5 ? "0 0 8px rgba(255, 100, 0, 0.6)" : "none",
          }}
        />
      </div>

      {/* Page counter */}
      {totalPages > 0 && (
        <span
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: pct >= 95 ? "#ff8c00" : "rgba(255,255,255,0.5)",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            transition: "color 0.3s ease",
            fontFamily: "monospace",
          }}
        >
          {displayPage} / {totalPages}
        </span>
      )}
    </div>
  );
};

export default ViewerProgressBar;