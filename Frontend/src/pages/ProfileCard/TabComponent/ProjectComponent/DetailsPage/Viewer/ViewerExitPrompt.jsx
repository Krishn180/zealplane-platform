import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, ChevronRight, Bookmark } from "lucide-react";
import {
  subscribeToPushNotifications,
  isUserSubscribed,
  isPushNotificationSupported,
} from "../../../../../../utils/pushNotifications";

/**
 * ViewerExitPrompt
 *
 * Contextual push notification prompt shown INSIDE the comic viewer.
 * Triggered by exit-intent signals — not a generic site-wide prompt.
 *
 * Two triggers (whichever fires first):
 *   1. Mouse leaves the top of the viewport (desktop cursor exit-intent)
 *   2. Reader scrolls BACK UP after having read at least 3 pages
 *      (strong signal of hesitation / about-to-leave)
 *
 * Framing: "Save your progress" / chapter drop alert — NOT "subscribe to push".
 * Loss-aversion copy: focuses on what they'll MISS if they leave, not what they gain.
 *
 * Props:
 *   currentPage   {number} 0-indexed page the reader is currently on
 *   totalPages    {number} total images in chapter
 *   chapterName   {string} e.g. "Karma - Chapter 1"
 *   nextChapterName {string|null} e.g. "Karma - Chapter 2" or null
 */

const STORAGE_KEY = "zp_viewer_exit_prompt_dismissed";
const MIN_PAGES_READ = 3; // Don't show until reader has committed this many pages

const ViewerExitPrompt = ({
  currentPage = 0,
  totalPages = 0,
  chapterName = "",
  nextChapterName = null,
}) => {
  const [visible, setVisible] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyShown, setAlreadyShown] = useState(false);

  const maxPageReachedRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const containerRef = useRef(null);

  // Track max page reached so scroll-back detection is accurate
  useEffect(() => {
    if (currentPage > maxPageReachedRef.current) {
      maxPageReachedRef.current = currentPage;
    }
  }, [currentPage]);

  // Check if already subscribed or dismissed — skip if so
  useEffect(() => {
    if (!isPushNotificationSupported()) return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) { setAlreadyShown(true); return; }

    isUserSubscribed().then((yes) => {
      if (yes) setSubscribed(true);
    });
  }, []);

  const triggerPrompt = useCallback(() => {
    if (alreadyShown || subscribed || visible) return;
    if (maxPageReachedRef.current < MIN_PAGES_READ) return;
    setVisible(true);
    setAlreadyShown(true);
    localStorage.setItem(STORAGE_KEY, "1");
  }, [alreadyShown, subscribed, visible]);

  // Trigger 1: mouse leaves top of viewport (desktop exit-intent)
  useEffect(() => {
    const onMouseLeave = (e) => {
      if (e.clientY <= 0) triggerPrompt();
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [triggerPrompt]);

  // Trigger 2: scroll-back up after reading ≥ 3 pages
  useEffect(() => {
    const container = document.querySelector(".viewer__container");
    if (!container) return;
    containerRef.current = container;

    const onScroll = () => {
      const current = container.scrollTop;
      const prev = lastScrollTopRef.current;
      // Scrolling upward by more than 150px after reading significant content
      if (prev - current > 150 && maxPageReachedRef.current >= MIN_PAGES_READ) {
        triggerPrompt();
      }
      lastScrollTopRef.current = current;
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [triggerPrompt]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await subscribeToPushNotifications();
      setSubscribed(true);
      setSuccess(true);
      setVisible(false);
    } catch {
      // Permission denied or unsupported — fail silently, just close
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!isPushNotificationSupported() || subscribed || !visible) return null;

  const pagesLeft = totalPages - currentPage - 1;
  const comicShortName = (chapterName || "").split(" - ")[0] || "this comic";

  return (
    <>
      {/* Backdrop blur */}
      <div
        onClick={handleDismiss}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(3px)",
          zIndex: 19998,
          animation: "vep-fade-in 0.25s ease both",
        }}
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Save your reading progress"
        style={{
          position: "fixed",
          bottom: "50%",
          left: "50%",
          transform: "translate(-50%, 50%)",
          zIndex: 19999,
          width: "min(420px, calc(100vw - 32px))",
          background: "linear-gradient(160deg, #0f0f1a 0%, #1a0a00 100%)",
          border: "1px solid rgba(255, 69, 0, 0.45)",
          borderRadius: "18px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,100,0,0.12) inset",
          padding: "28px 24px 24px 24px",
          animation: "vep-slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        {/* Dismiss X */}
        <button
          onClick={handleDismiss}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "rgba(255,255,255,0.07)",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <X size={14} />
        </button>

        {/* Icon row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #ff4500, #ff8c00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(255,69,0,0.4)",
            }}
          >
            <Bookmark size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#ff8c00", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.7px" }}>
              Don't lose your place
            </div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#fff", lineHeight: 1.2, marginTop: "2px" }}>
              You've read {maxPageReachedRef.current + 1} pages of {comicShortName}
            </div>
          </div>
        </div>

        {/* Loss-aversion copy */}
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: "0 0 8px 0" }}>
          {nextChapterName
            ? <>Get notified the moment <strong style={{ color: "#fff" }}>{nextChapterName}</strong> goes live — so you're the first to read it.</>
            : <>Enable alerts and we'll ping you the moment the next chapter of <strong style={{ color: "#fff" }}>{comicShortName}</strong> drops. Free, no spam.</>
          }
        </p>

        {pagesLeft > 0 && (
          <p style={{ fontSize: "12px", color: "rgba(255,140,0,0.8)", margin: "0 0 20px 0", fontWeight: "600" }}>
            ⚡ {pagesLeft} page{pagesLeft !== 1 ? "s" : ""} left in this chapter — come back and finish.
          </p>
        )}

        {/* CTA */}
        <button
          id="viewer-exit-notify-btn"
          onClick={handleSubscribe}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: loading
              ? "rgba(255,69,0,0.5)"
              : "linear-gradient(135deg, #ff4500 0%, #ff8c00 100%)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: loading ? "none" : "0 6px 20px rgba(255,69,0,0.35)",
            transition: "all 0.2s ease",
            marginBottom: "10px",
          }}
        >
          <Bell size={17} />
          {loading ? "Enabling alerts…" : "Notify me when Chapter 2 drops"}
          {!loading && <ChevronRight size={16} />}
        </button>

        <button
          onClick={handleDismiss}
          style={{
            width: "100%",
            padding: "10px",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.3)",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          I'll risk missing it
        </button>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes vep-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes vep-slide-up {
          from { opacity: 0; transform: translate(-50%, calc(50% + 30px)); }
          to   { opacity: 1; transform: translate(-50%, 50%); }
        }
      `}</style>
    </>
  );
};

export default ViewerExitPrompt;
