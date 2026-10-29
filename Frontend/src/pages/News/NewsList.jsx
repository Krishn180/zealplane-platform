import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/header/Header";
import axiosInstance from "../../Auth/Axios";
import Footer from "../../components/footer/Footer";
import dehekEng from "../../assets/dehek-eng.jpg";
import "./NewsList.scss";

// Verified Fallback Asset
const DEFAULT_FALLBACK_IMAGE = "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731190/project_images/1784731189062-WhatsApp-Image-2026-04-25-at-11.jpg";

// ZealPlane Editorial Beats
const DEPARTMENTS = [
  {
    id: "all",
    name: "All Beats",
    color: "#f47521",
    tagline: "Live daily dispatches across Indian indie comics, global manga, and visual craft."
  },
  {
    id: "indie",
    name: "Indie Comics",
    color: "#f47521",
    featuredSlug: "bharatiya-comics-online-kaise-padhe-2026-hindi-guide",
    keywords: ["indie", "indian", "raj comics", "nagraj", "dhruva", "dhruv", "doga", "shaktimaan", "swapnil", "tinkle", "amar chitra", "karma", "hittu", "graphic novel", "chullu", "desi", "webcomics"],
    tagline: "Indian independent comics, creator spotlights, and graphic novel movements."
  },
  {
    id: "manga",
    name: "Manga & Anime",
    color: "#fbbf24",
    featuredSlug: "how-sukuna-bypassed-infinity-kill-gojo-world-cutting-slash-explained",
    keywords: ["manga", "anime", "one piece", "jujutsu", "jjk", "demon slayer", "chainsaw", "shonen", "bleach", "dragon ball", "solo leveling", "kagurabachi", "naruto", "manhwa", "hxh", "hunter", "oda", "dandadan", "sakamoto", "jojo", "cosplay"],
    tagline: "Weekly Shonen Jump breakdowns, anime releases, and serialization news."
  },
  {
    id: "films",
    name: "Screen & Cinema",
    color: "#f43f5e",
    featuredSlug: "mcu-x-men-reboot-cast-rogue-mister-sinister-jean-grey",
    keywords: ["film", "movie", "tv", "marvel", "mcu", "dc", "batman", "superman", "avengers", "harry potter", "hbo", "netflix", "hollywood", "cinema", "warner", "supergirl", "disney", "x-men", "deadpool"],
    tagline: "Cinematic adaptations, superhero film news, and streaming series."
  }
];

// Featured Original In-Browser Comics on ZealPlane (Platform Bridge)
const PLATFORM_COMICS = [
  {
    id: "karma",
    title: "Karma",
    creator: "ZealPlane Studio",
    genre: "Dark Fantasy / Action",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731190/project_images/1784731189062-WhatsApp-Image-2026-04-25-at-11.jpg",
    url: "/viewer/6a60d6370cb3db69eafea318-karma"
  },
  {
    id: "detective-hittu",
    title: "Detective Hittu (English)",
    creator: "Shobhinaw Satyaa",
    genre: "Noir Detective",
    poster: dehekEng,
    url: "/viewer/68fd8ec7d3f27884af371c0d-detective-hittu-english"
  },
  {
    id: "prana",
    title: "PRANA!",
    creator: "ZealPlane Originals",
    genre: "Mythology / Manga",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
    url: "/viewer/6a6cb052b666434fc607cc3c-prana-english-chapter-1"
  },
  {
    id: "ghost-in-the-crowd",
    title: "Ghost in the Crowd",
    creator: "Prince Ayush",
    genre: "Cyberpunk / Thriller",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1745070346/project_images/ehw9l263wzphdttq8x2g.jpg",
    url: "/viewer/6803a90bdab5a44638dc9f85-ghost-in-the-crowd"
  },
  {
    id: "chullu",
    title: "Chullu Parilok Me",
    creator: "Swapnil Comics",
    genre: "Comedy / Fantasy",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg",
    url: "/viewer/6a770154adc3e27012ff8608-chullu-parilok-me"
  }
];

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [activeDept, setActiveDept] = useState("all");
  const [activeLang, setActiveLang] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const userId = localStorage.getItem("Id");
  const allowedUserId = "63a87bd4-08ed-4c06-9080-2a891c0efbfa";

  useEffect(() => {
    setVisibleCount(12);
  }, [activeDept, activeLang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    axiosInstance
      .get(`${apiBaseUrl}/news`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNews(res.data);
        }
      })
      .catch((err) => console.error("Error fetching news:", err));
  }, [apiBaseUrl]);

  const isHindiContent = (item) => {
    if (!item) return false;
    const title = item.title || "";
    const content = item.content || "";
    const tags = (item.tags || []).join(" ").toLowerCase();
    const isDevanagari = /[\u0900-\u097F]/.test(title) || /[\u0900-\u097F]/.test(content.slice(0, 200));
    const isHindiTagged = tags.includes("hindi") || tags.includes("हिंदी") || tags.includes("desi");
    return isDevanagari || isHindiTagged || (item.language && item.language.toLowerCase().includes("hi"));
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min read";
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const formatSafeDate = (raw) => {
    if (!raw) return "Oct 2026";
    const d = new Date(raw);
    return isNaN(d.getTime())
      ? "Oct 2026"
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
  };

  const getFullImageUrl = (url) => {
    if (!url) return DEFAULT_FALLBACK_IMAGE;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://www.zealplane.com${url}`;
    return `https://www.zealplane.com/${url}`;
  };

  const getItemCoverImage = (item) => {
    if (!item) return DEFAULT_FALLBACK_IMAGE;
    const imgUrl = item.image || item.coverImage;
    if (imgUrl && imgUrl.trim() !== "" && !imgUrl.includes("og-image.jpg")) {
      return getFullImageUrl(imgUrl);
    }
    if (item.content) {
      const match = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        return getFullImageUrl(match[1]);
      }
    }
    return DEFAULT_FALLBACK_IMAGE;
  };

  const stripHtmlAndTruncate = (content, limit) => {
    if (!content) return "";
    let cleanText = content.replace(/<[^>]*>/g, "");
    cleanText = cleanText
      .replace(/[*_#`~>]/g, "")
      .replace(/&mdash;/g, "—")
      .replace(/&ndash;/g, "–")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .trim();
    if (cleanText.length <= limit) return cleanText;
    return cleanText.slice(0, limit) + "...";
  };

  const getArticleDepartment = (item) => {
    if (!item) return DEPARTMENTS[1];
    if (item.category) {
      const cat = item.category.trim();
      if (cat === "Gaming") return DEPARTMENTS.find((d) => d.id === "gaming") || DEPARTMENTS[1];
      if (cat === "Manga & Anime" || cat === "Anime" || cat === "Manga") return DEPARTMENTS.find((d) => d.id === "manga") || DEPARTMENTS[2];
      if (cat === "Screen & Cinema" || cat === "Movies") return DEPARTMENTS.find((d) => d.id === "films") || DEPARTMENTS[3];
      if (cat === "Indie Comics" || cat === "Indian Comics" || cat === "Comics" || cat === "Creator Spotlight") return DEPARTMENTS.find((d) => d.id === "indie") || DEPARTMENTS[1];
    }
    const text = ((item.title || "") + " " + (item.tags || []).join(" ")).toLowerCase();
    for (let i = 1; i < DEPARTMENTS.length; i++) {
      const dept = DEPARTMENTS[i];
      if (dept.keywords && dept.keywords.some((k) => text.includes(k))) {
        return dept;
      }
    }
    return DEPARTMENTS[1];
  };

  // Language Filtering
  const filteredByLang = news.filter((item) => {
    const isHindi = isHindiContent(item);
    if (activeLang === "hi" && !isHindi) return false;
    if (activeLang === "en" && isHindi) return false;
    return true;
  });

  // Department Filtering
  const filteredNews = filteredByLang.filter((item) => {
    if (activeDept === "all") return true;
    return getArticleDepartment(item).id === activeDept;
  });

  const getDeptCount = (deptId) => {
    if (deptId === "all") return filteredByLang.length;
    return filteredByLang.filter((item) => getArticleDepartment(item).id === deptId).length;
  };

  const activeDeptObj = DEPARTMENTS.find((d) => d.id === activeDept) || DEPARTMENTS[0];

  // Designated flagship hero story for this beat, or fallback to first available
  const heroItem = (activeDeptObj.featuredSlug && filteredNews.find((item) => item.slug === activeDeptObj.featuredSlug))
    || (filteredNews.length > 0 ? filteredNews[0] : null);

  // Companion wire dispatches (the other top articles excluding heroItem)
  const remainingNews = filteredNews.filter((item) => item._id !== heroItem?._id);
  const leadWireItems = remainingNews.slice(0, 4);
  // Rest of the stream
  const streamItems = remainingNews.slice(4);
  const visibleStreamItems = streamItems.slice(0, visibleCount);

  // Curated editorial spotlights for frontpage
  const mangaSpotlightItems = activeDept === "all"
    ? filteredByLang.filter((item) => getArticleDepartment(item).id === "manga" && item._id !== heroItem?._id).slice(0, 6)
    : [];

  const indieSpotlightItems = activeDept === "all"
    ? filteredByLang.filter((item) => getArticleDepartment(item).id === "indie" && item._id !== heroItem?._id).slice(0, 4)
    : [];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterStatus("Subscribed. You are on the ZealPlane Dispatch list.");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterStatus(null), 5000);
  };

  return (
    <>
      <Header />

      <div className="zeal-news-experience">
        {/* ── 1. The ZealPulse Live Ticker ── */}
        {news.length > 0 && (
          <div className="zeal-pulse-ticker-bar" aria-label="Live breaking updates">
            <div className="ticker-shell">
              <div className="ticker-brand-badge">
                <span className="pulse-beacon" aria-hidden="true" />
                <span className="beacon-title">ZEALPULSE</span>
              </div>
              <div className="ticker-viewport">
                <div className="ticker-rail">
                  {[...news.slice(0, 10), ...news.slice(0, 10)].map((item, idx) => (
                    <span key={`ticker-${idx}-${item._id}`} className="ticker-segment">
                      <Link to={`/news/${item.slug}`} className="ticker-anchor">
                        {item.title}
                      </Link>
                      <span className="ticker-separator" aria-hidden="true">/</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="zeal-news-container">
          {/* ── 2. ZealPlane Newsroom Command Masthead ── */}
          <header className="zeal-masthead-command">
            <div className="masthead-top-tier">
              <div className="brand-lockup">
                <button className="back-command-btn" onClick={handleGoBack} aria-label="Go back">
                  ← Back
                </button>
                <div className="brand-title-group">
                  <div className="brand-logo-text">
                    <span className="logo-zeal">ZEAL</span>
                    <span className="logo-plane">PLANE</span>
                    <span className="logo-hub">CHRONICLES</span>
                  </div>
                  <span className="brand-tagline">
                    The Official Newsroom for Indian Indie Comics, Manga & Digital Pop Culture
                  </span>
                </div>
              </div>

              <div className="masthead-controls">
                <div className="edition-selector" role="group" aria-label="Edition filter">
                  <button
                    className={`edition-chip ${activeLang === "all" ? "selected" : ""}`}
                    onClick={() => setActiveLang("all")}
                  >
                    All ({news.length})
                  </button>
                  <button
                    className={`edition-chip ${activeLang === "en" ? "selected" : ""}`}
                    onClick={() => setActiveLang("en")}
                  >
                    English ({news.filter((i) => !isHindiContent(i)).length})
                  </button>
                  <button
                    className={`edition-chip ${activeLang === "hi" ? "selected" : ""}`}
                    onClick={() => setActiveLang("hi")}
                  >
                    हिंदी ({news.filter((i) => isHindiContent(i)).length})
                  </button>
                </div>

                {userId === allowedUserId && (
                  <button
                    className="publish-post-btn"
                    onClick={() => navigate("/add-news")}
                  >
                    + File Story
                  </button>
                )}
              </div>
            </div>

            {/* Department Navigation Segmented Bar */}
            <nav className="zeal-segmented-beats" aria-label="Editorial Beats">
              {DEPARTMENTS.map((dept) => {
                const count = getDeptCount(dept.id);
                const isActive = activeDept === dept.id;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    className={`beat-segment ${isActive ? "active-segment" : ""}`}
                    onClick={() => setActiveDept(dept.id)}
                    style={{ "--beat-accent": dept.color }}
                  >
                    <span className="beat-dot" style={{ backgroundColor: dept.color }} />
                    <span className="beat-name">{dept.name}</span>
                    <span className="beat-count">{count}</span>
                  </button>
                );
              })}
            </nav>
          </header>

          {filteredNews.length > 0 ? (
            <>
              {/* ── 3. ZealPlane Frontpage Broadsheet Spread (Lead Story + Breaking Wire Dossier) ── */}
              {heroItem && (
                <section className="zeal-broadsheet-showcase" aria-label="Frontpage Lead Coverage">
                  {/* Lead Feature Story Card */}
                  <div className="lead-hero-dossier">
                    <div className="lead-hero-visual-frame">
                      <Link to={`/news/${heroItem.slug}`} className="lead-hero-artwork-link">
                        <img
                          src={getItemCoverImage(heroItem)}
                          alt={heroItem.title}
                          className="lead-hero-artwork"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                        <div className="lead-hero-overlay-scrim" />
                        <span
                          className="lead-hero-tag"
                          style={{
                            backgroundColor: `${getArticleDepartment(heroItem).color}e6`,
                            boxShadow: `0 4px 14px ${getArticleDepartment(heroItem).color}40`
                          }}
                        >
                          {getArticleDepartment(heroItem).name}
                        </span>
                      </Link>
                    </div>

                    <div className="lead-hero-editorial-body">
                      <div className="lead-kicker-strip">
                        <span
                          className="lead-dept-badge"
                          style={{
                            color: getArticleDepartment(heroItem).color,
                            borderColor: `${getArticleDepartment(heroItem).color}40`,
                            backgroundColor: `${getArticleDepartment(heroItem).color}15`
                          }}
                        >
                          <span
                            className="kicker-pip"
                            style={{ backgroundColor: getArticleDepartment(heroItem).color }}
                          />
                          {getArticleDepartment(heroItem).name}
                        </span>
                        <span className="kicker-sep">•</span>
                        <time className="lead-date-label">
                          {formatSafeDate(heroItem.createdAt || heroItem.publishedAt || heroItem.date)}
                        </time>
                      </div>

                      <h1 className="lead-hero-headline">
                        <Link to={`/news/${heroItem.slug}`}>
                          {heroItem.title}
                        </Link>
                      </h1>

                      <div
                        className="lead-accent-laser"
                        style={{ background: `linear-gradient(90deg, ${getArticleDepartment(heroItem).color}, transparent)` }}
                      />

                      <p className="lead-hero-summary">
                        {stripHtmlAndTruncate(heroItem.content, 260)}
                      </p>

                      <div className="lead-meta-row">
                        <span className="lead-byline">
                          By <Link to="/about" style={{ color: "#ff8e35", textDecoration: "underline", textUnderlineOffset: "2px" }}>{heroItem.author || "Krishna Kumar"}</Link>
                        </span>
                        <span className="meta-sep">•</span>
                        <span className="lead-readtime">
                          {calculateReadTime(heroItem.content)}
                        </span>
                        {heroItem.views >= 50 && (
                          <>
                            <span className="meta-sep">•</span>
                            <span className="lead-readers-count">
                              {heroItem.views.toLocaleString()} readers
                            </span>
                          </>
                        )}
                      </div>

                      <div className="lead-action-wrap">
                        <Link to={`/news/${heroItem.slug}`} className="lead-read-button">
                          Read Full Coverage <span className="btn-arrow">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Asymmetric Companion Dossier (Top Wire) */}
                  <aside className="lead-wire-companion" aria-label="Breaking Wire Top Dispatches">
                    <div className="wire-companion-header">
                      <div className="wire-beacon-box">
                        <span className="wire-beacon-dot" />
                        <span className="wire-header-kicker">BREAKING WIRE</span>
                      </div>
                      <span className="wire-pulse-label">Top Dispatches</span>
                    </div>

                    <div className="wire-companion-list">
                      {leadWireItems.map((item, idx) => {
                        const dept = getArticleDepartment(item);
                        return (
                          <Link
                            key={`lead-wire-${item._id}`}
                            to={`/news/${item.slug}`}
                            className="wire-companion-item"
                          >
                            <span className="wire-index-number">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="wire-text-stack">
                              <div className="wire-dept-line">
                                <span
                                  className="wire-dept-pip"
                                  style={{ backgroundColor: dept.color }}
                                />
                                <span className="wire-dept-name">{dept.name}</span>
                                <span className="wire-meta-time">
                                  {calculateReadTime(item.content)}
                                </span>
                              </div>
                              <h3 className="wire-item-headline">{item.title}</h3>
                            </div>
                            <div className="wire-thumb-holder">
                              <img
                                src={getItemCoverImage(item)}
                                alt={item.title}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                                }}
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </aside>
                </section>
              )}

              {/* ── 3B. Manga & Anime Spotlight Shelf (Frontpage Only) ── */}
              {activeDept === "all" && mangaSpotlightItems.length > 0 && (
                <section className="zeal-editorial-shelf manga-spotlight-shelf" aria-label="Manga and Anime Spotlight">
                  <div className="shelf-headline-bar">
                    <div className="shelf-title-group">
                      <span className="shelf-badge-pill manga">⚡ MANGA SPOTLIGHT</span>
                      <h2 className="shelf-heading">Shonen Jump, Manhwa &amp; Serialization Forensics</h2>
                      <p className="shelf-subtext">
                        Direct narrative breakdowns, panel pacing analysis, and studio production developments.
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="shelf-view-all-btn manga"
                      onClick={() => {
                        setActiveDept("manga");
                        document.getElementById("zeal-daily-feed-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      View All Manga ({getDeptCount("manga")}) →
                    </button>
                  </div>

                  <div className="shelf-magazine-grid">
                    {mangaSpotlightItems.map((item) => (
                      <article key={`manga-spot-${item._id}`} className="shelf-magazine-card">
                        <Link to={`/news/${item.slug}`} className="shelf-card-link">
                          <div className="shelf-card-cover">
                            <img
                              src={getItemCoverImage(item)}
                              alt={item.title}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                              }}
                            />
                            <span className="shelf-card-tag manga">MANGA</span>
                          </div>
                          <div className="shelf-card-content">
                            <div className="shelf-card-meta">
                              <time>{formatSafeDate(item.createdAt || item.publishedAt || item.date)}</time>
                              <span className="meta-dot">•</span>
                              <span>{calculateReadTime(item.content)}</span>
                            </div>
                            <h3 className="shelf-card-title">{item.title}</h3>
                            <p className="shelf-card-excerpt">{stripHtmlAndTruncate(item.content, 95)}</p>
                            <div className="shelf-card-byline">
                              By <span>{item.author || "Krishna Kumar"}</span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* ── 4. "From News to Panels" — ZealPlane Original Comics Bridge ── */}
              <section className="zeal-comic-bridge-shelf" aria-label="Read Original Comics">
                <div className="bridge-shelf-header">
                  <div>
                    <span className="shelf-super-title">ZEALPLANE ORIGINAL READS</span>
                    <h2 className="shelf-main-heading">From News To Panels: Read Original Indie Comics Online</h2>
                    <p className="shelf-sub-desc">
                      Zero paywalls. Direct in-browser reader. Dive straight into original Indian graphic novels created by independent writers and artists.
                    </p>
                  </div>
                  <Link to="/search" className="shelf-all-link">
                    Explore All 46+ Titles →
                  </Link>
                </div>

                <div className="bridge-comics-deck">
                  {PLATFORM_COMICS.map((comic) => (
                    <Link key={comic.id} to={comic.url} className="bridge-comic-card">
                      <div className="comic-cover-container">
                        <img
                          src={comic.poster}
                          alt={comic.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                        <div className="comic-edge-shine" />
                        <span className="free-read-pill">FREE READ</span>
                      </div>
                      <div className="comic-info-panel">
                        <span className="comic-genre-slug">{comic.genre}</span>
                        <h3 className="comic-card-title">{comic.title}</h3>
                        <span className="comic-author-credit">By {comic.creator}</span>
                        <span className="comic-open-action">Read Online →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* ── 4B. Indian Indie Comics & Graphic Novels Spotlight Shelf (Frontpage Only) ── */}
              {activeDept === "all" && indieSpotlightItems.length > 0 && (
                <section className="zeal-editorial-shelf indie-spotlight-shelf" aria-label="Indian Indie Comics Spotlight">
                  <div className="shelf-headline-bar">
                    <div className="shelf-title-group">
                      <span className="shelf-badge-pill indie">🇮🇳 INDIE COMICS SPOTLIGHT</span>
                      <h2 className="shelf-heading">Indian Indie Comics &amp; Graphic Novel Movement</h2>
                      <p className="shelf-subtext">
                        Retrospectives on Raj Comics, modern self-publishing creators, and vernacular graphic literature.
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="shelf-view-all-btn indie"
                      onClick={() => {
                        setActiveDept("indie");
                        document.getElementById("zeal-daily-feed-section")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      View All Indie Stories ({getDeptCount("indie")}) →
                    </button>
                  </div>

                  <div className="shelf-magazine-grid four-col">
                    {indieSpotlightItems.map((item) => (
                      <article key={`indie-spot-${item._id}`} className="shelf-magazine-card">
                        <Link to={`/news/${item.slug}`} className="shelf-card-link">
                          <div className="shelf-card-cover">
                            <img
                              src={getItemCoverImage(item)}
                              alt={item.title}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                              }}
                            />
                            <span className="shelf-card-tag indie">INDIE COMICS</span>
                          </div>
                          <div className="shelf-card-content">
                            <div className="shelf-card-meta">
                              <time>{formatSafeDate(item.createdAt || item.publishedAt || item.date)}</time>
                              <span className="meta-dot">•</span>
                              <span>{calculateReadTime(item.content)}</span>
                            </div>
                            <h3 className="shelf-card-title">{item.title}</h3>
                            <p className="shelf-card-excerpt">{stripHtmlAndTruncate(item.content, 95)}</p>
                            <div className="shelf-card-byline">
                              By <span>{item.author || "Krishna Kumar"}</span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* ── 5. Main Article Stream & Intelligence Sidebar ── */}
              <div className="zeal-layout-dual-col" id="zeal-daily-feed-section">
                {/* News Feed Main Column */}
                <main className="zeal-feed-stream">
                  <div className="feed-header-row">
                    <div>
                      <span className="feed-kicker">DAILY DISPATCHES</span>
                      <h2 className="feed-stream-title">
                        {activeDept === "all" ? "All Filings" : activeDeptObj.name}
                      </h2>
                    </div>
                    <span className="feed-stories-total">Showing {Math.min(visibleCount, streamItems.length)} of {streamItems.length} Articles</span>
                  </div>

                  <div className="zeal-articles-flow">
                    {visibleStreamItems.map((item) => {
                      const dept = getArticleDepartment(item);
                      return (
                        <article key={item._id} className="zeal-article-entry">
                          <Link to={`/news/${item.slug}`}>
                            <div className="entry-figure-wrap">
                              <img
                                src={getItemCoverImage(item)}
                                alt={item.title}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                                }}
                              />
                              <div className="entry-figure-shade" />
                              <span
                                className="entry-dept-chip"
                                style={{
                                  backgroundColor: `${dept.color}25`,
                                  color: dept.color,
                                  borderColor: `${dept.color}50`
                                }}
                              >
                                {dept.name}
                              </span>
                            </div>

                            <div className="entry-content-wrap">
                              <div className="entry-timestamp-line">
                                <span
                                  className="dept-dot-indicator"
                                  style={{ backgroundColor: dept.color }}
                                  aria-hidden="true"
                                />
                                <span className="dept-label-name">{dept.name}</span>
                                <span className="dot-divider">•</span>
                                <time className="entry-date-stamp">
                                  {formatSafeDate(item.createdAt || item.publishedAt || item.date)}
                                </time>
                                <span className="dot-divider">•</span>
                                <span className="entry-author-byline" style={{ color: "#94a3b8" }}>
                                  By {item.author || "Krishna Kumar"}
                                </span>
                              </div>

                              <h3 className="entry-article-title">{item.title}</h3>

                              <p className="entry-snippet">
                                {stripHtmlAndTruncate(item.content, 120)}
                              </p>

                              <div className="entry-card-footer">
                                <span className="footer-duration">
                                  {calculateReadTime(item.content)}
                                </span>
                                {item.views >= 50 && (
                                  <span className="footer-views">
                                    {item.views.toLocaleString()} readers
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </article>
                      );
                    })}
                  </div>

                  {/* ── Load More Stories Pagination Control ── */}
                  {visibleCount < streamItems.length ? (
                    <div className="zeal-load-more-wrap">
                      <button 
                        type="button" 
                        className="zeal-load-more-btn"
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                      >
                        <span className="load-more-text">Load More Chronicles</span>
                        <span className="load-more-counter">({visibleStreamItems.length} of {streamItems.length}) ↓</span>
                      </button>
                    </div>
                  ) : streamItems.length > 12 ? (
                    <div className="zeal-all-caught-up-banner">
                      <span className="caught-up-icon">✓</span>
                      <span className="caught-up-text">You have reached the end of the latest ZealPlane chronicles.</span>
                    </div>
                  ) : null}
                </main>

                {/* Intelligence Sidebar */}
                <aside className="zeal-sidebar-column" aria-label="Intelligence sidebar">
                  {/* The ZealPlane Dispatch Newsletter */}
                  <div className="zeal-side-card dispatch-box-card">
                    <span className="side-card-kicker">THE DISPATCH</span>
                    <h3 className="dispatch-title">Daily Intelligence on Indian Comics & Pop Culture</h3>
                    <p className="dispatch-desc">
                      Join hundreds of comic readers and creators receiving breaking scoops, manga serialization breakdowns, and indie chapter updates.
                    </p>

                    <form onSubmit={handleNewsletterSubmit} className="dispatch-form-group">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email address"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="dispatch-input-field"
                      />
                      <button type="submit" className="dispatch-submit-btn">
                        Subscribe Free →
                      </button>
                    </form>
                    {newsletterStatus && (
                      <p className="dispatch-success-msg">{newsletterStatus}</p>
                    )}
                    <span className="dispatch-privacy-line">
                      Direct to inbox. Zero spam. Cancel anytime.
                    </span>
                  </div>

                  {/* Top Indie Comics Stand */}
                  <div className="zeal-side-card comic-stand-card">
                    <div className="side-card-header">
                      <span className="side-card-kicker">READ ONLINE FREE</span>
                      <h3 className="side-card-title">Popular Indie Comics</h3>
                    </div>

                    <div className="stand-comic-stack">
                      {PLATFORM_COMICS.slice(0, 4).map((comic, idx) => (
                        <Link key={`stand-${comic.id}`} to={comic.url} className="stand-comic-tile">
                          <span className="comic-rank-num">{idx + 1}</span>
                          <img
                            src={comic.poster}
                            alt={comic.title}
                            className="stand-poster-thumb"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                            }}
                          />
                          <div className="stand-text-info">
                            <h4 className="stand-title-line">{comic.title}</h4>
                            <span className="stand-genre-line">{comic.genre}</span>
                            <span className="stand-read-action">Read Free →</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Creator Mission Card */}
                  <div className="zeal-side-card creator-mission-card">
                    <span className="side-card-kicker">CREATOR PLATFORM</span>
                    <h3 className="creator-mission-title">Publish Your Comic on ZealPlane</h3>
                    <p className="creator-mission-desc">
                      Are you an indie artist or writer? ZealPlane gives Indian creators an in-browser platform with zero paywalls, instant readership, and creator monetization.
                    </p>
                    <a href="mailto:support@zealplane.com" className="creator-submit-link">
                      Submit Your Title →
                    </a>
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <div className="zeal-empty-state">
              <h3>No stories published under this beat yet</h3>
              <p>{activeDeptObj.tagline}</p>
              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => {
                  setActiveDept("all");
                  setActiveLang("all");
                }}
              >
                View All Beats
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NewsList;
