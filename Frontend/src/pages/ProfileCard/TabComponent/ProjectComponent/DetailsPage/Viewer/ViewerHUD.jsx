import { useEffect, useState } from "react";
import { Play, Pause, Eye, EyeOff, Moon, Coffee, Sun, Music2, MessageSquare } from "lucide-react";

const AVG_SEC_PER_PAGE = 14; // ~14 seconds average read time per comic page

// ─────────────────────────────────────────────────────────────────────────────
const ViewerHUD = ({
  currentPage,
  totalPages,
  theme,
  onThemeChange,
  isImmersive,
  onToggleImmersive,
  autoScrolling,
  onToggleAutoScroll,
  musicVisible,
  onToggleMusic,
  onOpenDetails,
}) => {
  const [showKbHint, setShowKbHint] = useState(true);

  // Keyboard hint disappears after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowKbHint(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // Esc key exits immersive mode
  useEffect(() => {
    if (!isImmersive) return;
    const onKey = (e) => { if (e.code === "Escape") onToggleImmersive(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isImmersive, onToggleImmersive]);

  if (!totalPages) return null;

  const pagesLeft = totalPages - currentPage - 1;
  const minsLeft  = Math.max(0, Math.ceil((pagesLeft * AVG_SEC_PER_PAGE) / 60));

  return (
    <div className="ve-hud" role="status" aria-label="Reading progress and controls">

      {/* Page counter + time estimate */}
      <div className="ve-hud__top">
        <span className="ve-hud__page">
          Page <strong>{currentPage + 1}</strong>
          <span className="ve-hud__sep">/</span>
          {totalPages}
        </span>

        <span className="ve-hud__time">
          {pagesLeft === 0
            ? "Last page! 🎉"
            : minsLeft > 0
            ? `~${minsLeft} min left`
            : "Almost done!"}
        </span>
      </div>

      {/* Controls: auto-scroll, immersive, music, themes */}
      <div className="ve-hud__controls">
        <button
          className={`ve-hud__btn ${autoScrolling ? "active" : ""}`}
          onClick={onToggleAutoScroll}
          title={autoScrolling ? "Pause auto-scroll" : "Start auto-scroll"}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          {autoScrolling ? <Pause size={14} /> : <Play size={14} />}
          <span>Auto</span>
        </button>

        <button
          className={`ve-hud__btn ${isImmersive ? "active" : ""}`}
          onClick={onToggleImmersive}
          title={isImmersive ? "Exit Focus mode (Esc)" : "Toggle Focus mode"}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          {isImmersive ? <EyeOff size={14} /> : <Eye size={14} />}
          <span>{isImmersive ? "Focus ON" : "Focus"}</span>
        </button>

        <button
          className={`ve-hud__btn ${musicVisible ? "active" : ""}`}
          onClick={onToggleMusic}
          title="Ambient music"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Music2 size={14} />
          <span>Music</span>
        </button>

        {onOpenDetails && (
          <button
            className="ve-hud__btn"
            onClick={onOpenDetails}
            title="Comic Info, Chapters & Comments"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <MessageSquare size={14} />
            <span>Comments</span>
          </button>
        )}

        <div className="ve-hud__themes" role="group" aria-label="Reading theme">
          {[
            { key: "dark",  icon: <Moon size={14} />, label: "Dark" },
            { key: "sepia", icon: <Coffee size={14} />, label: "Sepia" },
            { key: "light", icon: <Sun size={14} />, label: "Light" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              className={`ve-hud__theme-btn ${theme === key ? "active" : ""}`}
              onClick={() => onThemeChange(key)}
              title={`${label} theme`}
              aria-pressed={theme === key}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard hint — fades naturally via CSS after 7s */}
      {showKbHint && (
        <div className="ve-hud__kb-hint" aria-hidden="true">
          ← → arrow keys · navigate pages
        </div>
      )}
    </div>
  );
};

export default ViewerHUD;
