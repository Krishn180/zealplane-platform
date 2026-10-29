import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaBell, FaTimes, FaCheck } from "react-icons/fa";
import { subscribeToPushNotifications, isUserSubscribed, isPushNotificationSupported } from "../../utils/pushNotifications";
import "./NotificationPrompt.scss";

function getPageContext(pathname) {
  const path = (pathname || "").toLowerCase();
  const docTitle = typeof document !== "undefined" ? (document.title || "").toLowerCase() : "";
  const combined = `${path} ${docTitle}`;

  if (combined.includes("one-piece") || combined.includes("one piece") || combined.includes("luffy") || combined.includes("elbaf") || combined.includes("god-valley") || combined.includes("god valley") || combined.includes("void-century") || combined.includes("op119") || combined.includes("oda")) {
    return {
      franchise: "one-piece",
      topic: "manga-spoilers",
      title: "One Piece Spoilers & Release Alerts",
      desc: "Never miss One Piece chapter breakdowns, Sunday Jump leaks, and Oda lore drops.",
      btnText: "Notify Me On One Piece",
      tooltip: "Get One Piece Chapter Alerts"
    };
  }

  if (combined.includes("jujutsu") || combined.includes("jjk") || combined.includes("sukuna") || combined.includes("gojo") || combined.includes("gege")) {
    return {
      franchise: "jujutsu-kaisen",
      topic: "manga-spoilers",
      title: "Jujutsu Kaisen News & Chapter Alerts",
      desc: "Get instant pings when Gege Akutami updates, Modulo arcs, and anime news drop.",
      btnText: "Get JJK Alerts",
      tooltip: "Get Jujutsu Kaisen Alerts"
    };
  }

  if (combined.includes("chainsaw") || combined.includes("denji") || combined.includes("fujimoto")) {
    return {
      franchise: "chainsaw-man",
      topic: "manga-spoilers",
      title: "Chainsaw Man Chapter Alerts",
      desc: "Instant alerts when fresh Tatsuki Fujimoto chapters and story developments drop.",
      btnText: "Notify Me On CSM",
      tooltip: "Get Chainsaw Man Alerts"
    };
  }

  if (combined.includes("hunter") || combined.includes("hxh") || combined.includes("togashi")) {
    return {
      franchise: "hunter-x-hunter",
      topic: "manga-spoilers",
      title: "Hunter x Hunter Release Alerts",
      desc: "Stay informed the moment Togashi drops new Dark Continent chapters & updates.",
      btnText: "Get HxH Alerts",
      tooltip: "Get Hunter x Hunter Alerts"
    };
  }

  if (combined.includes("kagurabachi") || combined.includes("hokazono")) {
    return {
      franchise: "kagurabachi",
      topic: "manga-spoilers",
      title: "Kagurabachi Chapter Alerts",
      desc: "Be the first to read new Hokazono chapter theories and sword-bearer breakdowns.",
      btnText: "Get Kagurabachi Alerts",
      tooltip: "Get Kagurabachi Alerts"
    };
  }

  if (combined.includes("gta") || combined.includes("rockstar") || combined.includes("vice city")) {
    return {
      franchise: "gta-6",
      topic: "gaming-news",
      title: "GTA 6 Leaks & Trailer Alerts",
      desc: "Get notified first when Rockstar drops official Vice City gameplay and trailers.",
      btnText: "Notify Me On GTA 6",
      tooltip: "Get GTA 6 Alerts"
    };
  }

  if (combined.includes("karma") || combined.includes("chullu") || combined.includes("prana") || combined.includes("sando") || combined.includes("pepper") || combined.includes("indian comic") || combined.includes("raj comic") || path.includes("/viewer") || path.includes("/explore")) {
    return {
      franchise: "indian-comics",
      topic: "indie-releases",
      title: "New Indie Comic Chapter Alerts",
      desc: "Get alerted the moment fresh chapters of Indian manga and indie comics go live.",
      btnText: "Follow Indie Drops",
      tooltip: "Get Indie Comic Alerts"
    };
  }

  if (path.includes("manga-release-calendar")) {
    return {
      franchise: "manga-calendar",
      topic: "manga-calendar",
      title: "Weekly Sunday Manga Reminders",
      desc: "Get pinged every Sunday when official VIZ & MANGA Plus chapters release.",
      btnText: "Set Sunday Reminders",
      tooltip: "Set Sunday Manga Reminders"
    };
  }

  return {
    franchise: "general",
    topic: "general",
    title: "Catch New Chapters & Breakdowns First",
    desc: "We post original indie comics and chapter breakdowns every week. Get a quick ping when new stories drop.",
    btnText: "Notify Me",
    tooltip: "Enable Chapter & Breakdown Alerts"
  };
}

const NotificationPrompt = () => {
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const context = getPageContext(location.pathname);

  useEffect(() => {
    if (!isPushNotificationSupported()) return;

    // Check existing subscription
    isUserSubscribed().then((subscribed) => {
      setIsSubscribed(subscribed);
      if (subscribed) return;

      const dismissedUntil = localStorage.getItem("zp_push_dismissed_until");
      const isDismissedRecently = dismissedUntil && Date.now() < Number(dismissedUntil);

      // On high-intent franchise articles (like One Piece, JJK), show prompt even if previously dismissed generally
      const isHighIntentPage = context.franchise !== "general";

      if (!isDismissedRecently || isHighIntentPage) {
        const delay = isHighIntentPage ? 5000 : 4000;
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    });
  }, [location.pathname, context.franchise]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const slug = location.pathname.startsWith("/news/") ? location.pathname.replace("/news/", "") : "";
      await subscribeToPushNotifications({
        franchise: context.franchise,
        topic: context.topic,
        slug
      });
      setIsSubscribed(true);
      setShowBanner(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4500);
    } catch (err) {
      console.log("Push subscription canceled or failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Dismiss for 48 hours instead of permanently locking the reader out
    localStorage.setItem("zp_push_dismissed_until", (Date.now() + 48 * 60 * 60 * 1000).toString());
  };

  if (!isPushNotificationSupported()) return null;

  return (
    <>
      {/* Floating Bell Trigger Button (When Not Subscribed & Banner Closed) */}
      {!isSubscribed && !showBanner && (
        <button
          className="zp-push-floating-bell"
          onClick={() => setShowBanner(true)}
          title={context.tooltip}
          aria-label={context.tooltip}
        >
          <FaBell className="bell-icon ring-anim" />
          <span className="bell-pulse"></span>
        </button>
      )}

      {/* Modern Slide-Up Context-Aware Toast Banner */}
      {showBanner && (
        <div className="zp-push-prompt-banner slide-up">
          <div className="banner-left-icon">
            <div className="icon-circle">
              <FaBell />
            </div>
          </div>
          <div className="banner-text-content">
            <h4>{context.title}</h4>
            <p>{context.desc}</p>
            <div className="banner-actions">
              <button
                className="btn-enable-push"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? "Connecting..." : context.btnText}
              </button>
              <button className="btn-dismiss-push" onClick={handleDismiss}>
                Maybe later
              </button>
            </div>
          </div>
          <button
            className="btn-close-banner"
            onClick={handleDismiss}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="zp-push-success-toast">
          <FaCheck className="check-icon" />
          <span>
            {context.franchise !== "general"
              ? `You're all set! We'll alert you whenever new ${context.franchise.replace("-", " ")} updates drop.`
              : "You're all set! We'll ping you when new stories go live."}
          </span>
        </div>
      )}
    </>
  );
};

export default NotificationPrompt;
