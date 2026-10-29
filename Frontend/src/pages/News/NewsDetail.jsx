import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import Newsletter from "../../components/Newsletter/Newsletter";
import Header from "../../components/header/Header";
import linkifyHtml from "linkify-html";
import "./NewsDetail.scss";
import Footer from "../../components/footer/Footer";

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showScrollSlideIn, setShowScrollSlideIn] = useState(false);
  const [pollAuthModal, setPollAuthModal] = useState({ isOpen: false, pollId: "", optionId: "", recordAndRender: null });
  const [spotlightSlot, setSpotlightSlot] = useState(null);
  const [amazonSlot, setAmazonSlot] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const authorizedUserId = "d836e39a-9964-4499-8c23-a85e8c78156f";

  const AD_FREE_ARTICLE_SLUGS = [
    "webtoon-canvas-size-guide-slicing-formatting-tutorial",
    "jujutsu-kaisen-season-4-release-date-culling-game-part-2"
  ];

  const NO_COMIC_PROMO_SLUGS = [
    "new-big-three-manga-what-replaces-jujutsu-kaisen",
    "are-demon-slayer-breathing-effects-real-or-visual-gotouge-canon-explained",
    "geometry-of-chaos-how-eiichiro-oda-draws-one-piece-double-spreads",
    "how-sukuna-bypassed-infinity-kill-gojo-world-cutting-slash-explained"
  ];

  useEffect(() => {
    // Dynamic robots meta management for delisted / noindex articles
    let robotsMeta = document.querySelector('meta[name="robots"]');
    const noIndexSlugs = [
      "pepper-and-carrot-why-this-open-source-webcomic-has-a-passionate-global-following",
      "prana-the-indian-indie-manga-that-is-quietly-building-something-special",
      "swapnil-comics-the-creator-keeping-the-spirit-of-classic-hindi-comics-alive"
    ];
    const isNoIndexArticle = noIndexSlugs.includes(slug);
    
    if (isNoIndexArticle) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else {
      if (robotsMeta) {
        robotsMeta.setAttribute("content", "index, follow");
      }
    }

    return () => {
      const meta = document.querySelector('meta[name="robots"]');
      if (meta) {
        meta.setAttribute("content", "index, follow");
      }
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowScrollSlideIn(false);
    const saved = JSON.parse(localStorage.getItem("zp_saved_news") || "[]");
    setIsBookmarked(saved.includes(slug));

    axios
      .get(`${apiBaseUrl}/news/${slug}`)
      .then((res) => setNews(res.data))
      .catch((err) => console.error("Error fetching news:", err));

    axios
      .get(`${apiBaseUrl}/news`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setRecentArticles(res.data.filter((item) => item.slug !== slug).slice(0, 4));
        }
      })
      .catch((err) => console.error("Error fetching recent news:", err));

    // Behavioral Economics: 42% Scroll Depth Slide-In Trigger (Catch engaged readers early)
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;
      if (totalHeight > 0 && scrollPosition / totalHeight >= 0.42) {
        setShowScrollSlideIn(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug, apiBaseUrl]);



  const handleBookmarkToggle = () => {
    const saved = JSON.parse(localStorage.getItem("zp_saved_news") || "[]");
    let updated;
    if (saved.includes(slug)) {
      updated = saved.filter((s) => s !== slug);
      setIsBookmarked(false);
    } else {
      updated = [...saved, slug];
      setIsBookmarked(true);
      setShowBookmarkToast(true);
      setTimeout(() => setShowBookmarkToast(false), 3500);

      // Track article bookmark event to MongoDB backend
      try {
        const userId = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon";
        fetch("/api/behavior/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            projectId: "6a60d6370cb3db69eafea317",
            customAction: "news_article_bookmarked",
            articleSlug: slug
          })
        }).catch(() => {});
      } catch (_) {}

      const userToken = localStorage.getItem("token") || localStorage.getItem("user");
      if (!userToken) {
        setShowLoginPrompt(true);
      }
    }
    localStorage.setItem("zp_saved_news", JSON.stringify(updated));
  };

  // ── Auto-Inject Mid-Article Comic Funnel Spotlight & Amazon Affiliate ──
  useEffect(() => {
    if (!news?.content) return;

    // During AdSense review window, disable mid-article text interruptions completely
    setSpotlightSlot(null);
    setAmazonSlot(null);
  }, [news?.content, slug]);

  // ── Smart International Amazon Link Localization (US tag: zealplane-20) ──
  useEffect(() => {
    if (!news?.content) return;
    try {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
      const isIndia = tz.includes("calcutta") || tz.includes("kolkata") || tz.includes("colombo") || tz.includes("asia/karachi");
      if (!isIndia) {
        const timer = setTimeout(() => {
          const container = document.querySelector(".news-content-rendered");
          if (!container) return;
          const links = container.querySelectorAll('a[href*="amazon.in"]');
          links.forEach((a) => {
            a.href = a.href
              .replace("www.amazon.in", "www.amazon.com")
              .replace("amazon.in", "amazon.com")
              .replace("tag=zealplane-21", "tag=zealplane-20");
            a.target = "_blank";
            a.rel = "sponsored nofollow noopener noreferrer";
          });
        }, 300);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, [news?.content]);

  // ── Interactive News Poll Handler & Highest Conversion Auto-Placement ──
  useEffect(() => {
    if (!news?.content) return;

    const attachPolls = () => {
      const container = document.querySelector(".news-content-rendered");
      if (!container) return;

      // 1. Locate existing poll box or generate dynamic poll box if article lacks one
      let pollBox = container.querySelector(".interactive-poll-box");

      if (!pollBox) {
        const dynamicPollId = `poll_${slug || "general"}`;
        const pollWrapper = document.createElement("div");
        pollWrapper.className = "interactive-poll-box";
        pollWrapper.setAttribute("data-poll-id", dynamicPollId);
        
        pollWrapper.innerHTML = `
          <h3 class="poll-question">What is your take on this story?</h3>
          <p class="poll-subtitle">Select an option below to view live community breakdown</p>
          <div class="poll-options">
            <button class="poll-option-btn" data-option-id="opt_agree" data-initial-votes="48">
              <span class="option-text">I agree with the points made in this report</span>
            </button>
            <button class="poll-option-btn" data-option-id="opt_disagree" data-initial-votes="22">
              <span class="option-text">I have a different perspective on this topic</span>
            </button>
            <button class="poll-option-btn" data-option-id="opt_hyped" data-initial-votes="34">
              <span class="option-text">Waiting for further official updates before deciding</span>
            </button>
          </div>
          <div class="poll-footer">
            <span class="poll-votes-count">Select an option to vote</span>
          </div>
        `;
        pollBox = pollWrapper;
      }

      // 2. CLEAN EDITORIAL MODEL: Position Poll cleanly at the VERY END of the article body
      // This preserves 100% clean editorial text flow while serving as a post-reading community engagement hook.
      if (container) {
        if (pollBox.parentNode) {
          pollBox.parentNode.removeChild(pollBox);
        }
        container.appendChild(pollBox);
      }

      // 3. ZERO-FRICTION 1-TAP VOTING ATTACHMENT
      const pollId = pollBox.getAttribute("data-poll-id") || `poll_${slug || "default"}`;
      const savedVote = localStorage.getItem("zp_poll_vote_" + pollId);
      const options = Array.from(pollBox.querySelectorAll(".poll-option-btn"));

      const renderResults = (selectedId) => {
        let total = 0;
        const votesMap = {};

        options.forEach((opt) => {
          const optId = opt.getAttribute("data-option-id");
          let count = parseInt(opt.getAttribute("data-initial-votes") || "25", 10);
          if (optId === selectedId) count += 1;
          votesMap[optId] = count;
          total += count;
        });

        options.forEach((opt) => {
          const optId = opt.getAttribute("data-option-id");
          const count = votesMap[optId] || 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
          const isUserChoice = optId === selectedId;

          opt.classList.add("poll-result-item");
          if (isUserChoice) opt.classList.add("user-selected");
          opt.disabled = true;

          const textEl = opt.querySelector(".option-text");
          const labelHtml = textEl ? textEl.innerHTML : opt.innerText;

          opt.innerHTML = `
            <div class="poll-bar-fill" style="width: ${pct}%;"></div>
            <div class="poll-result-content">
              <span class="poll-result-label">${labelHtml} ${isUserChoice ? '<span class="poll-voted-tag">Your Vote</span>' : ''}</span>
              <span class="poll-result-pct">${pct}%</span>
            </div>
          `;
        });

        const footerEl = pollBox.querySelector(".poll-footer");
        if (footerEl) {
          footerEl.innerHTML = `
            <span class="poll-votes-count">${total.toLocaleString()} votes cast</span>
          `;
        }
      };

      if (savedVote) {
        renderResults(savedVote);
      } else {
        options.forEach((opt) => {
          opt.onclick = (e) => {
            e.preventDefault();
            const optId = opt.getAttribute("data-option-id");

            // Instant 1-tap vote execution
            localStorage.setItem("zp_poll_vote_" + pollId, optId);
            renderResults(optId);

            // Record vote in background via non-blocking fetch
            try {
              const userId = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon";
              fetch(`${apiBaseUrl}/news/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  pollId,
                  optionId: optId,
                  newsSlug: slug
                })
              }).catch(() => {});

              fetch("/api/behavior/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  customAction: "news_poll_voted",
                  pollId,
                  optionId: optId,
                  newsSlug: slug
                })
              }).catch(() => {});
            } catch (_) {}
          };
        });
      }
    };

    const timer = setTimeout(attachPolls, 150);
    return () => clearTimeout(timer);
  }, [news?.content, slug, apiBaseUrl]);

  const handlePollGoogleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) return;

      const decoded = jwtDecode(googleToken);
      const userEmail = decoded.email;

      try {
        const userRes = await axios.post(`${apiBaseUrl}/users/google-login`, { token: googleToken });
        if (userRes.data?.user) {
          const { id, username, token, profilePic, points } = userRes.data.user;
          localStorage.setItem("Id", id);
          localStorage.setItem("username", username);
          localStorage.setItem("token", token);
          if (profilePic) localStorage.setItem("profilePic", profilePic);
          if (points) localStorage.setItem("points", points);
        }
      } catch (err) {
        console.warn("User google login:", err);
      }

      try {
        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, {
          email: userEmail,
          source: `poll_vote_${pollAuthModal.pollId}`
        });
      } catch (_) {}

      localStorage.setItem("zp_poll_verified_email", userEmail);

      if (pollAuthModal.recordAndRender) {
        pollAuthModal.recordAndRender();
      }

      setPollAuthModal({ isOpen: false, pollId: "", optionId: "", recordAndRender: null });
      toast.success(`🎉 Vote Recorded! Signed in as ${userEmail}`);
    } catch (err) {
      console.error("Poll google auth error:", err);
      toast.error("Google 1-Click Login failed. Please try again.");
    }
  };

  // ── Outbound Kindle Click Tracker ──
  useEffect(() => {
    if (!news?.content) return;

    const timer = setTimeout(() => {
      const container = document.querySelector(".news-content-rendered");
      if (!container) return;

      const handleLinkClick = (e) => {
        const target = e.target.closest("a");
        if (!target) return;
        const href = target.getAttribute("href") || "";

        if (href.includes("amazon.in") || href.includes("amazon.com") || href.includes("B0D7367ZHM")) {
          try {
            const userId = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon";
            fetch("/api/behavior/track", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId,
                projectId: "god_novel_kindle",
                enquiryOpened: true,
                customAction: "amazon_god_hindi_novel_click"
              })
            }).catch(() => {});
          } catch (_) {}
        }
      };

      container.addEventListener("click", handleLinkClick);
      return () => {
        container.removeEventListener("click", handleLinkClick);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [news?.content]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/news");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;

    try {
      await axios.delete(`${apiBaseUrl}/news/${slug}`);
      alert("News deleted successfully");
      navigate("/news");
    } catch (err) {
      alert("Error deleting news");
      console.error(err);
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min read";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const formatSafeDate = (raw) => {
    if (!raw) return "October 2026";
    const d = new Date(raw);
    return isNaN(d.getTime())
      ? "October 2026"
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const getFullImageUrl = (url) => {
    if (!url) return "https://www.zealplane.com/og-image.jpg";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://www.zealplane.com${url}`;
    return `https://www.zealplane.com/${url}`;
  };

  const formatArticleContent = (rawContent) => {
    if (!rawContent) return "<p>No content available</p>";

    let html = rawContent.trim();

    // 1. Convert Markdown Images: ![alt](url) -> <figure><img src="url" alt="alt" /></figure>
    html = html.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s\)]+|\/[^\s\)]+)\)/g, (match, alt, url) => {
      const caption = alt && alt.trim() ? `<figcaption style="font-size: 13.5px; color: #94a3b8; font-style: italic; margin-top: 10px; text-align: center;">${alt.trim()}</figcaption>` : "";
      return `<figure class="news-inline-figure" style="margin: 36px 0; text-align: center;"><img src="${url}" alt="${alt}" loading="lazy" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08);" />${caption}</figure>`;
    });

    // 2. Convert Markdown Links: [text](url) -> <a href="url">text</a> (support relative /... and absolute http)
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+|\/[^\s\)]+)\)/g, (match, text, url) => {
      const isExternal = url.startsWith("http") && !url.includes("zealplane.com");
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}" class="news-inline-link"${target}>${text}</a>`;
    });

    // 3. Convert Markdown Bold: **text** -> <strong>text</strong> (multiline safe)
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');

    // 4. Clean any legacy affiliate showcase boxes
    html = html.replace(/<div class="zealplane-affiliate-showcase"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi, '');
    html = html.replace(/<div class="zealplane-affiliate-showcase"[\s\S]*?<\/div>\s*<\/div>/gi, '');

    // If content is already HTML block elements, return it now with markdown links/images converted
    if (/^<(p|h[1-6]|figure|div|ul|ol|blockquote|section|article|table|img|!--)/i.test(html)) {
      return html;
    }

    // 4. Convert Headings:
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // 5. Convert Horizontal Rules
    html = html.replace(/^(?:---|___|\*\*\*)\s*$/gm, '<hr />');

    // 6. Convert Blockquotes: > quote
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

    // 7. Convert Italic
    html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em>$2</em>$3');

    // 8. Split into paragraphs if not already in HTML container
    const blocks = html.split(/\n\s*\n/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|figure|blockquote|hr|ul|ol|p|div|section|button|img|table|!--)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    }).filter(Boolean).join("\n\n");

    return html;
  };

  const currentUrl = window.location.href;

  const handleShare = (platform) => {
    const title = news?.title || "ZealPlane News";
    if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${currentUrl}`)}`, "_blank");
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
    } else if (platform === "copy") {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!news) return (
    <div className="news-loading-screen" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner"></div>
    </div>
  );

  const currentUserId = typeof window !== "undefined" ? (localStorage.getItem("Id") || localStorage.getItem("userId")) : null;
  const showDeleteButton = Boolean(
    currentUserId && (currentUserId === authorizedUserId || (news.authorId && currentUserId === news.authorId))
  );

  return (
    <>
      <Header />

      <div className="news-detail-page-wrapper">
        {/* Clickable Ticker Bar */}
        <div className="news-ticker-bar">
          <div className="ticker-container">
            <Link to="/news" className="ticker-label">ZEALPLANE CHRONICLES</Link>
            <span className="ticker-divider">|</span>
            <span className="ticker-text">Indie Comic Industry, Pop-Culture &amp; Gaming Insights</span>
            <Link to="/news" className="ticker-all-link">All News &amp; Articles →</Link>
          </div>
        </div>

        <div className="news-detail-layout">
          <main className="news-detail-main">
            {/* Direct Navigation & Breadcrumbs */}
            <div className="news-detail-header-bar">
              <Link to="/news" className="back-btn">
                ← All Chronicles &amp; News
              </Link>

              <nav className="news-breadcrumb-nav" aria-label="Breadcrumb">
                <Link to="/" className="bc-link">Home</Link>
                <span className="bc-sep">/</span>
                <Link to="/news" className="bc-link">News</Link>
                {news.category && (
                  <>
                    <span className="bc-sep">/</span>
                    <span className="bc-cat">{news.category}</span>
                  </>
                )}
              </nav>

              {showDeleteButton && (
                <button className="delete-news-btn" onClick={handleDelete}>
                  🗑️ Delete Article
                </button>
              )}
            </div>

            <h1 className="news-title">{news.title}</h1>

            <div className="news-author-byline-card">
              <div className="author-info">
                <Link to="/about" className="author-avatar" title={`Read about ${news.author || "Krishna Kumar"}`}>
                  <span>{(news.author || "Krishna Kumar")[0].toUpperCase()}</span>
                </Link>
                <div className="author-details">
                  <span className="author-name">
                    By <Link to="/about" className="author-byline-link" title={`View author profile for ${news.author || "Krishna Kumar"}`}>
                      {news.author || "Krishna Kumar"}
                    </Link>
                  </span>
                  <div className="article-meta-info">
                    <span className="news-date">
                      {formatSafeDate(news.createdAt || news.publishedAt || news.date || news.updatedAt)}
                    </span>
                    <span className="meta-dot">•</span>
                    <span className="read-time">{calculateReadTime(news.content)}</span>
                    {news.views >= 50 && (
                      <>
                        <span className="meta-dot">•</span>
                        <span className="views-badge" style={{ color: "#ff8e35", fontWeight: 600 }}>👁️ {news.views.toLocaleString()} Views</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="social-share-group">
                <button 
                  className={`bookmark-btn ${isBookmarked ? "saved" : ""}`}
                  onClick={handleBookmarkToggle}
                  title={isBookmarked ? "Remove from saved stories" : "Save story"}
                >
                  <i className={isBookmarked ? "fas fa-bookmark" : "far fa-bookmark"}></i>
                  <span>{isBookmarked ? "Saved" : "Save"}</span>
                </button>

                <span className="share-label">Share:</span>
                <button 
                  className="share-btn whatsapp" 
                  onClick={() => handleShare("whatsapp")}
                  title="Share on WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button 
                  className="share-btn twitter" 
                  onClick={() => handleShare("twitter")}
                  title="Share on Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button 
                  className="share-btn facebook" 
                  onClick={() => handleShare("facebook")}
                  title="Share on Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button 
                  className="share-btn copy" 
                  onClick={() => handleShare("copy")}
                  title="Copy link"
                >
                  <i className="fas fa-link"></i>
                </button>
                {copied && <span className="copied-toast">Copied</span>}
              </div>
            </div>

            {showLoginPrompt && (
              <div className="save-account-banner">
                <div className="banner-text">
                  <span className="banner-title">Saved to this browser</span>
                  <span className="banner-sub">Log in to sync your saved reading list across devices.</span>
                </div>
                <div className="banner-links">
                  <Link to="/login" className="banner-link">Log in</Link>
                  <button className="banner-close" onClick={() => setShowLoginPrompt(false)}>✕</button>
                </div>
              </div>
            )}

            {/* Feature Hero Image */}
            {(news.image || news.coverImage) && (
              <figure className="news-hero-figure">
                <img src={getFullImageUrl(news.image || news.coverImage)} alt={news.title} />
              </figure>
            )}

            <article className="news-article-body">
              <div
                className="news-content-rendered"
                dangerouslySetInnerHTML={{
                  __html: formatArticleContent(news.content),
                }}
              />


              {/* AUTHOR BIO & EDITORIAL ACCOUNTABILITY CARD */}
              <section className="article-author-bio-card" aria-label="About the author">
                <div className="author-bio-wrapper">
                  <Link to="/about" className="author-bio-avatar-frame" title={`View ${news.author || "Krishna Kumar"}'s profile`}>
                    <span className="author-avatar-initial">{(news.author || "Krishna Kumar")[0].toUpperCase()}</span>
                  </Link>
                  <div className="author-bio-identity">
                    <div className="author-title-badge-row">
                      <span className="author-kicker-label">Written By</span>
                    </div>
                    <h3 className="author-display-name">
                      <Link to="/about" className="author-profile-link">
                        {news.author || "Krishna Kumar"}
                      </Link>
                    </h3>
                    <p className="author-bio-summary">
                      {news.author && (news.author.toLowerCase().includes("arti") || news.author.toLowerCase().includes("jaishree"))
                        ? `${news.author} is a contributing writer at ZealPlane, dedicated to covering Indian comic lore, indie creator spotlights, and global manga industry developments.`
                        : "Krishna Kumar is an indie comic creator (Karma, Boomba) and published author of G.O.D (Game of Death). He writes technical breakdowns on panel flow, webtoon canvas slicing, and deep-dive analysis into the evolving manga landscape. Have feedback, tips, or a story pitch?"}
                    </p>
                    <div style={{ fontSize: "12px", color: "#94a3b8", margin: "10px 0 14px", lineHeight: "1.5", background: "rgba(255, 255, 255, 0.04)", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                      🛡️ <strong>Editorial Standards &amp; Fact-Checking:</strong> ZealPlane articles adhere to strict primary-source attribution, non-piracy reporting guidelines, and creator-first editorial ethics. Every breakdown is verified against official releases (MANGA Plus, Shueisha, or authorized publishers).
                    </div>
                    <div className="author-bio-actions">
                      <Link to="/about" className="author-action-pill primary">
                        <span>About Author</span>
                        <span className="pill-arrow">→</span>
                      </Link>
                      <Link to="/contact-us" className="author-action-pill outline">
                        <span>Contact Editorial Desk</span>
                      </Link>
                      <a 
                        href="https://x.com/plane38843" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="author-social-pill"
                        title="Follow on X / Twitter"
                      >
                        <i className="fab fa-x-twitter"></i>
                        <span>@plane38843</span>
                      </a>
                      <a 
                        href="https://www.linkedin.com/company/zealplane" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="author-social-pill"
                        title="Connect on LinkedIn"
                      >
                        <i className="fab fa-linkedin-in"></i>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* HIGH-CONVERSION NEWSLETTER & USER REGISTRATION CARD */}
              <div className="article-signup-cta-card" style={{
                margin: "40px 0 30px",
                padding: "28px 24px",
                background: "linear-gradient(135deg, rgba(26, 31, 46, 0.95), rgba(15, 20, 32, 0.98))",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                textAlign: "center"
              }}>
                <div style={{ display: "inline-block", background: "rgba(230, 57, 70, 0.15)", color: "#ff4d5a", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
                  🔥 Never Miss A Manga Update
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
                  Get Free Weekly Manga Analysis &amp; Original Indie Comics
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "20px", maxWidth: "540px", margin: "0 auto 20px", lineHeight: "1.5" }}>
                  Join over 1,900+ readers getting exclusive early access to chapter releases, creator spotlights, and weekly chapter recaps &amp; editorial analysis.
                </p>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", maxWidth: "420px", margin: "0 auto 16px" }}>


                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const emailVal = e.target.email?.value;
                      if (!emailVal) return;
                      try {
                        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, { email: emailVal, source: "news_detail_article" });
                        toast.success("🎉 Subscribed successfully! Welcome to ZealPlane.");
                        e.target.reset();
                      } catch (err) {
                        toast.info("Subscribed successfully!");
                      }
                    }} 
                    style={{ display: "flex", gap: "8px", width: "100%" }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email..."
                      required
                      style={{
                        flex: "1",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none"
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: "none",
                        background: "linear-gradient(135deg, #e63946, #c1121f)",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </article>

            {recentArticles.length > 0 && (
              <section className="related-articles-section">
                <h3 className="section-title"><span>More Stories</span></h3>
                <div className="related-grid">
                  {recentArticles.map((art) => (
                    <Link to={`/news/${art.slug}`} key={art._id} className="related-card">
                      <div className="related-thumb">
                        <img src={getFullImageUrl(art.image || art.coverImage)} alt={art.title} />
                      </div>
                      <div className="related-info">
                        <h4>{art.title}</h4>
                        <span className="related-date">
                          {new Date(art.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="news-detail-sidebar">
            <div className="sidebar-widget featured-comics-widget">
              <h4>Trending Comics</h4>
              <div className="comic-mini-list">

                <Link to="/viewer/6a770154adc3e27012ff8608-chullu-parilok-me" className="comic-mini-card">
                  <span className="rank">2</span>
                  <img 
                    src="https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg" 
                    alt="Chullu Parilok Me" 
                    className="comic-mini-thumb" 
                  />
                  <div className="mini-details">
                    <span className="comic-title">Chullu Parilok Me</span>
                    <span className="comic-meta">Swapnil Comics · Fantasy</span>
                  </div>
                </Link>

                <Link to="/viewer/6803a90bdab5a44638dc9f85-ghost-in-the-crowd" className="comic-mini-card">
                  <span className="rank">3</span>
                  <img 
                    src="https://res.cloudinary.com/datgyuhmy/image/upload/v1745070346/project_images/ehw9l263wzphdttq8x2g.jpg" 
                    alt="Ghost in the Crowd" 
                    className="comic-mini-thumb" 
                  />
                  <div className="mini-details">
                    <span className="comic-title">Ghost in the Crowd</span>
                    <span className="comic-meta">Prince Ayush · Mystery</span>
                  </div>
                </Link>

                <Link to="/viewer/6a6cb052b666434fc607cc3c-prana-english-chapter-1" className="comic-mini-card">
                  <span className="rank">4</span>
                  <img 
                    src="https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp" 
                    alt="PRANA!" 
                    className="comic-mini-thumb" 
                  />
                  <div className="mini-details">
                    <span className="comic-title">PRANA!</span>
                    <span className="comic-meta">Mythology · Action</span>
                  </div>
                </Link>
              </div>
            </div>

            {recentArticles.length > 0 && (
              <div className="sidebar-widget recent-chronicles-widget">
                <div className="widget-header-row">
                  <h4>📰 Recent News</h4>
                  <Link to="/news" className="widget-view-all">All News →</Link>
                </div>
                <ul className="sidebar-recent-list">
                  {recentArticles.map((item) => (
                    <li key={item._id}>
                      <Link to={`/news/${item.slug}`}>
                        <span className="article-title">{item.title}</span>
                        <span className="article-date">
                          {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/news" className="sidebar-explore-all-btn">
                  Explore News Homepage →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Floating scroll slide-in disabled to keep reading experience clean and unobstructed */}

      {/* RELATED COMICS & MANGA DISCOVERY SECTION (Replacing duplicate bottom newsletter) */}
      <section className="related-comics-discovery-section" style={{
        maxWidth: "1240px",
        margin: "50px auto 30px",
        padding: "0 20px"
      }}>
        <div style={{
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "12px"
        }}>
          <div>
            <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
              Explore Original Series
            </span>
            <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", margin: "4px 0 0", fontFamily: "'Inter', sans-serif" }}>
              🎨 Popular Indie Comics &amp; Manga
            </h3>
          </div>
          <Link to="/" style={{ color: "#38bdf8", fontSize: "14px", fontWeight: "600", textDecoration: "none" }}>
            View Full Library →
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px"
        }}>

          {/* Card 2: Detective Hittu */}
          <Link to="/viewer/68fd8ec7d3f27884af371c0c-detective-hittu-english" style={{
            background: "rgba(30, 41, 59, 0.6)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textDecoration: "none"
          }}>
            <img 
              src="https://res.cloudinary.com/datgyuhmy/image/upload/v1745070346/project_images/ehw9l263wzphdttq8x2g.jpg" 
              alt="Detective Hittu" 
              style={{ width: "100%", height: "180px", objectFit: "cover" }} 
            />
            <div style={{ padding: "16px" }}>
              <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700", textTransform: "uppercase" }}>Comedy · Mystery</span>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "6px 0 4px" }}>Detective Hittu</h4>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
                Solving crimes completely by accident. The ultimate cat detective.
              </p>
            </div>
          </Link>

          {/* Card 3: PRANA */}
          <Link to="/viewer/6a6cb052b666434fc607cc3c-prana-english-chapter-1" style={{
            background: "rgba(30, 41, 59, 0.6)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textDecoration: "none"
          }}>
            <img 
              src="https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp" 
              alt="PRANA!" 
              style={{ width: "100%", height: "180px", objectFit: "cover" }} 
            />
            <div style={{ padding: "16px" }}>
              <span style={{ fontSize: "11px", color: "#a855f7", fontWeight: "700", textTransform: "uppercase" }}>Action · Mythology</span>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "6px 0 4px" }}>PRANA!</h4>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
                Ancient cosmic energy awakens in modern-day India.
              </p>
            </div>
          </Link>

          {/* Card 4: Chullu Parilok Me */}
          <Link to="/viewer/6a770154adc3e27012ff8608-chullu-parilok-me" style={{
            background: "rgba(30, 41, 59, 0.6)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            textDecoration: "none"
          }}>
            <img 
              src="https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg" 
              alt="Chullu Parilok Me" 
              style={{ width: "100%", height: "180px", objectFit: "cover" }} 
            />
            <div style={{ padding: "16px" }}>
              <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "700", textTransform: "uppercase" }}>Retro Digest</span>
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#fff", margin: "6px 0 4px" }}>Chullu Parilok Me</h4>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>
                Classic 90s nostalgia slapstick comedy by Swapnil Comics.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <Footer />

      {/* ── 1-CLICK GOOGLE POLL VOTE MODAL ── */}
      {pollAuthModal.isOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#161b26",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "20px",
            padding: "32px 24px",
            maxWidth: "440px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            position: "relative"
          }}>
            <button 
              onClick={() => setPollAuthModal({ isOpen: false, pollId: "", optionId: "", recordAndRender: null })}
              style={{
                position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "#888", fontSize: "20px", cursor: "pointer"
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚡</div>
            <h3 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>
              1-Click Reader Vote
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5", marginBottom: "20px" }}>
              Sign in with Google to cast your vote &amp; unlock live reader percentages. You'll also get occasional drops on original indie comics, manga chapters &amp; deep-dives — no spam, ever.
            </p>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <GoogleLogin
                onSuccess={handlePollGoogleSuccess}
                onError={() => toast.error("Google Sign-in Failed")}
                theme="filled_blue"
                shape="pill"
                size="large"
                text="continue_with"
              />
            </div>

            <div style={{ fontSize: "12px", color: "#64748b" }}>
              🔒 100% Real Readers · Zero Spam · Unsubscribe anytime with 1 click
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsDetail;
