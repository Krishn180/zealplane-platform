import React, { useState, useEffect } from "react";
import { Heart, Star, BookOpen, MessageSquare, ShieldCheck, CheckCheck, Sparkles, ArrowRight } from "lucide-react";
import { FaWhatsapp, FaTwitter, FaReddit, FaTelegram, FaLink } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../../../../../../Auth/Axios";
import ChapterAlertBox from "../../../../../../components/ChapterAlertBox/ChapterAlertBox";
import AmazonKindleCard from "../../../../../../components/AmazonKindleCard/AmazonKindleCard";
import { isHindiComic } from "../../../../../../utils/deduplicateComics";
import "./ChapterBreakOverlay.scss";

const ChapterBreakOverlay = ({
  currentChapterName = "",
  nextProject = null,
  onLoadNext = () => {},
  onNavigateHome = () => {},
  onNavigateForum = () => {},
  projectId = "",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dynamicRecommendations, setDynamicRecommendations] = useState([]);
  
  // Login state tracking
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uname = localStorage.getItem("username");
    if (token) {
      setIsUserLoggedIn(true);
      setLoggedInUsername(uname || "Reader");
    }

    // Save reading state bookmark to localStorage
    if (projectId && currentChapterName) {
      try {
        localStorage.setItem(
          "zp_last_read",
          JSON.stringify({
            projectId,
            title: currentChapterName,
            url: window.location.pathname,
            timestamp: Date.now(),
          })
        );
      } catch (_) {}
    }
  }, [projectId, currentChapterName]);

  // Fetch Dynamic Personalized Recommendations based on Language & Popularity
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/projects`);
        const allProjects = res.data || [];

        // Identify current comic properties
        const currentIsHindi = isHindiComic({ name: currentChapterName });
        
        // Filter out current project
        const others = allProjects.filter(p => {
          const pid = p.projectId || p._id;
          return pid !== projectId && p.name && p.thumbnailImage;
        });

        // Split into matching language group vs others
        const sameLang = others.filter(p => isHindiComic(p) === currentIsHindi);
        const altLang = others.filter(p => isHindiComic(p) !== currentIsHindi);

        // Sort same language by popularity (views + likes)
        const sortedSame = [...sameLang].sort((a, b) => 
          ((b.views || 0) + (b.likes || 0) * 10) - ((a.views || 0) + (a.likes || 0) * 10)
        );

        // Deduplicate series keys
        const extractKey = (n = "") => n.toLowerCase().split(/[-–—]/)[0].replace(/chapter\s*\d+/i, "").trim();
        const seen = new Set();
        const finalRecs = [];

        for (const p of [...sortedSame, ...altLang]) {
          const k = extractKey(p.name);
          if (!seen.has(k)) {
            seen.add(k);
            finalRecs.push({
              id: `${p.projectId || p._id}-${(p.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")}`,
              title: p.name,
              tag: isHindiComic(p) ? "🇮🇳 Hindi Comic" : "⚡ English Manga",
              image: p.thumbnailImage,
              views: p.views || 0,
            });
          }
          if (finalRecs.length >= 3) break;
        }

        setDynamicRecommendations(finalRecs);
      } catch (err) {
        console.error("Error fetching dynamic recommendations in viewer:", err);
      }
    };

    fetchRecommendations();
  }, [projectId, currentChapterName, apiBaseUrl]);

  const comicTitle = currentChapterName || "this chapter";
  const shareUrl = window.location.href;

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) {
        toast.error("Google login failed. No token received.");
        return;
      }

      const response = await axios.post(`${apiBaseUrl}/users/google-login`, {
        token: googleToken,
      });

      const {
        id: userId,
        username,
        token,
        refreshToken,
        profilePic,
        points = 0,
      } = response.data.user;

      localStorage.setItem("Id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      if (profilePic) {
        localStorage.setItem("profilePic", profilePic);
      }
      localStorage.setItem("points", points);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      setIsUserLoggedIn(true);
      setLoggedInUsername(username);

      toast.success(`Welcome ${username}! Reading progress saved.`);
    } catch (err) {
      console.error("Google Login error:", err);
      toast.error("Google Sign-in failed. Please try again.");
    }
  };

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    try {
      if (projectId) {
        await axiosInstance.post(`/projects/${projectId}/like`);
      }
    } catch (err) {
      console.error("Like recording failed:", err);
    }
  };

  const handleRating = (star) => {
    setRating(star);
    if (!isUserLoggedIn) {
      toast.info("Tip: Sign in with Google to save your rating to the comic's leaderboard.");
    } else {
      toast.success(`Rated ${star} stars.`);
    }
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      `🔥 I just read "${comicTitle}" on ZealPlane! It's 100% free with amazing indie art. Read it here: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Just finished reading "${comicTitle}" on @ZealPlane. Read it free online: ${shareUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnReddit = () => {
    const title = encodeURIComponent(`[Comic] Just read "${comicTitle}" on ZealPlane`);
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${title}`, "_blank");
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(`Read "${comicTitle}" free on ZealPlane:`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="chapter-break-card">
      <div className="chapter-break-header">
        <span className="finish-badge">✨ Chapter Completed</span>
        <h2 className="chapter-title">{comicTitle}</h2>
        <p className="chapter-subtext">
          You reached the end of this chapter. Save your reading progress, rate the story, or dive into your next recommended comic!
        </p>

        {/* High-contrast Action Button: Next Chapter or Explore Catalog */}
        <div className="next-chapter-action-box" style={{ margin: "22px 0 16px 0", display: "flex", justifyContent: "center" }}>
          {nextProject ? (
            <button 
              className="btn-next-chapter-cta" 
              onClick={() => {
                try {
                  const uid = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon";
                  fetch(`${apiBaseUrl}/behavior/track`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId: uid,
                      projectId: projectId,
                      currentChapterName: comicTitle,
                      nextProjectId: nextProject?.projectId || nextProject?._id,
                      customAction: "next_chapter_click",
                      timestamp: new Date().toISOString()
                    })
                  }).catch(() => {});
                } catch (_) {}
                onLoadNext();
              }}
              style={{
                background: "linear-gradient(135deg, #ff4500 0%, #ff8c00 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "32px",
                padding: "16px 32px",
                fontSize: "16.5px",
                fontWeight: "800",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow: "0 6px 22px rgba(255, 69, 0, 0.45)",
                transition: "all 0.2s ease"
              }}
            >
              <span>Read Next Chapter: {nextProject.name}</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              className="btn-next-chapter-cta" 
              onClick={() => navigate("/home")}
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                color: "#ffffff",
                border: "none",
                borderRadius: "32px",
                padding: "16px 32px",
                fontSize: "16.5px",
                fontWeight: "800",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow: "0 6px 22px rgba(37, 99, 235, 0.45)",
                transition: "all 0.2s ease"
              }}
            >
              <span>Explore More Comics in Catalog</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 1. ENGAGEMENT BAR: LIKE & RATING */}
      <div className="break-engagement-section">
        <div className="action-box">
          <button
            className={`btn-like ${liked ? "liked" : ""}`}
            onClick={handleLike}
            aria-label="Like this chapter"
          >
            <Heart size={18} fill={liked ? "#ff4500" : "none"} color={liked ? "#ff4500" : "currentColor"} />
            <span>{liked ? "Liked" : "Like chapter"}</span>
          </button>
        </div>

        <div className="rating-box">
          <span className="rating-label">Rate chapter:</span>
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`star-icon ${rating >= star ? "active" : ""}`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. INSTANT CHAPTER ALERTS NEWSLETTER CAPTURE */}
      <ChapterAlertBox
        seriesName={comicTitle}
        source="viewer_chapter_break"
        title={`Get instant alerts when the next chapter of ${comicTitle} drops!`}
        subtitle="Never miss an update. Enter your email to receive direct notifications the moment new pages are uploaded."
      />

      {/* 📱 OFFICIAL AUTHOR AMAZON KINDLE CARD (FOR KARMA & DETECTIVE HITTU) */}
      <AmazonKindleCard comicName={comicTitle} projectId={projectId} />

      {/* 3. SOFT LOGIN HOOK */}
      {!isUserLoggedIn ? (
        <div className="break-login-capture-banner">
          <div className="capture-text">
            <h4>Save your reading progress</h4>
            <p>
              Sign in with Google (free) to bookmark your place in <strong>{comicTitle}</strong> and receive updates for new releases.
            </p>
          </div>

          <div className="capture-auth-actions">
            <div className="google-btn-container">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error("Google Sign-in failed")}
                shape="pill"
                size="large"
                theme="filled_blue"
                text="continue_with"
              />
            </div>
            <div className="alt-auth-link">
              <span>or</span>
              <Link to="/login" className="email-signin-text">Sign in with Email</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="break-logged-in-badge">
          <ShieldCheck size={16} color="#00e676" />
          <span>Reading progress synced to <strong>{loggedInUsername}</strong>'s account</span>
        </div>
      )}

      {/* 4. 1-CLICK SOCIAL & WHATSAPP SHARE SUITE */}
      <div className="break-share-suite">
        <span className="share-suite-title">📲 Share this chapter with friends:</span>
        <div className="social-buttons-grid">
          <button className="social-btn whatsapp-btn" onClick={shareOnWhatsApp} title="Share on WhatsApp">
            <FaWhatsapp size={16} />
            <span>WhatsApp</span>
          </button>
          <button className="social-btn twitter-btn" onClick={shareOnTwitter} title="Share on X">
            <FaTwitter size={15} />
            <span>X (Twitter)</span>
          </button>
          <button className="social-btn reddit-btn" onClick={shareOnReddit} title="Share on Reddit">
            <FaReddit size={16} />
            <span>Reddit</span>
          </button>
          <button className="social-btn telegram-btn" onClick={shareOnTelegram} title="Share on Telegram">
            <FaTelegram size={15} />
            <span>Telegram</span>
          </button>
          <button className={`social-btn copy-btn ${copied ? "copied" : ""}`} onClick={copyToClipboard} title="Copy link">
            {copied ? <CheckCheck size={16} color="#00e676" /> : <FaLink size={14} />}
            <span>{copied ? "Copied" : "Copy link"}</span>
          </button>
        </div>
      </div>

      {/* 5. DYNAMICALLY PERSONALIZED "READERS ALSO ENJOYED" BINGE SHELF */}
      <div className="break-navigation-section">
        <div className="binge-recommendations-wrapper">
          <h4 className="binge-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="#ff8c00" />
            <span>Recommended Next For You:</span>
          </h4>
          
          <div className="binge-grid">
            {dynamicRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="binge-card"
                onClick={() => {
                  // Navigate directly to /viewer/ so the reader starts reading
                  // immediately rather than landing on the info/details page.
                  window.location.href = `/viewer/${rec.id}`;
                }}
                style={{ cursor: "pointer" }}
              >
                {rec.image && (
                  <img 
                    src={rec.image} 
                    alt={rec.title} 
                    style={{ width: "100%", height: "95px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} 
                  />
                )}
                <span className="binge-tag">{rec.tag}</span>
                <span className="binge-card-title">{rec.title}</span>
                <span style={{ fontSize: "11px", color: "#ff8c00", fontWeight: "700", marginTop: "6px", display: "inline-block" }}>
                  Start Reading →
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="secondary-options-row">
          <button className="btn-secondary-option" onClick={onNavigateForum}>
            <MessageSquare size={15} />
            <span>Community Forum</span>
          </button>
          <button className="btn-secondary-option" onClick={onNavigateHome}>
            <BookOpen size={15} />
            <span>Explore All Comics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterBreakOverlay;
