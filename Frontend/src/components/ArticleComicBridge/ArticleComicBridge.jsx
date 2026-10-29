import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ArticleComicBridge.scss";

// Curated ZealPlane Indie Comic Catalog
export const FEATURED_COMICS = {
  karma: {
    id: "6a60d6370cb3db69eafea318",
    slug: "6a60d6370cb3db69eafea318-karma",
    title: "KARMA",
    creator: "ZealPlane Originals",
    genre: "Dark Fantasy · Supernatural Action",
    rating: "4.9",
    views: "3.2K+",
    tagline: "When dark corruption engulfs the realm, Karma awakens without mercy.",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731190/project_images/1784731189062-WhatsApp-Image-2026-04-25-at-11.jpg",
    // First panel teaser image (page 1 of the comic)
    firstPanel: "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731190/project_images/1784731189062-WhatsApp-Image-2026-04-25-at-11.jpg",
    viewerUrl: "/viewer/6a60d6370cb3db69eafea318-karma?start=0",
    detailsUrl: "/details/6a60d6370cb3db69eafea318-karma",
  },
  chullu: {
    id: "6a770154adc3e27012ff8608",
    slug: "6a770154adc3e27012ff8608-chullu-parilok-me",
    title: "Chullu Parilok Me",
    creator: "Krishna",
    genre: "Supernatural Comedy · Fantasy",
    rating: "4.8",
    views: "1.1K+",
    tagline: "Chullu embarks on India's wildest, most hilarious celestial journey.",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg",
    firstPanel: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg",
    viewerUrl: "/viewer/6a770154adc3e27012ff8608-chullu-parilok-me?start=0",
    detailsUrl: "/details/6a770154adc3e27012ff8608-chullu-parilok-me",
  },
  sando: {
    id: "6862054388b4ebf35001fba9",
    slug: "6862054388b4ebf35001fba9-sando-ki-duniya",
    title: "Sando ki Duniya",
    creator: "Fictioncomics",
    genre: "Sci-Fi Adventure · Mystery",
    rating: "4.7",
    views: "850+",
    tagline: "Step into the extraordinary retro-futuristic universe of Sando.",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1755018691/project_images/1755018689449-sando.jpg",
    firstPanel: "https://res.cloudinary.com/datgyuhmy/image/upload/v1755018691/project_images/1755018689449-sando.jpg",
    viewerUrl: "/viewer/6862054388b4ebf35001fba9-sando-ki-duniya?start=0",
    detailsUrl: "/details/6862054388b4ebf35001fba9-sando-ki-duniya",
  },
  looteraBhoot: {
    id: "67b417e1b58fee068ef0be8e",
    slug: "67b417e1b58fee068ef0be8e-chullu-aur-lootera-bhoot",
    title: "Chullu aur Lootera Bhoot",
    creator: "Krishna",
    genre: "Horror Comedy · Folklore",
    rating: "4.9",
    views: "960+",
    tagline: "Spooky meets hilarious in this beloved desi horror adventure.",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1739855840/project_images/ekhl0euhzu3h3s1byii2.jpg",
    firstPanel: "https://res.cloudinary.com/datgyuhmy/image/upload/v1739855840/project_images/ekhl0euhzu3h3s1byii2.jpg",
    viewerUrl: "/viewer/67b417e1b58fee068ef0be8e-chullu-aur-lootera-bhoot?start=0",
    detailsUrl: "/details/67b417e1b58fee068ef0be8e-chullu-aur-lootera-bhoot",
  },
  prana: {
    id: "6a6cb052b666434fc607cc3c",
    slug: "6a6cb052b666434fc607cc3c-prana-english-chapter-1",
    title: "PRANA!",
    creator: "ZealPlane Originals",
    genre: "Mythology · Action",
    rating: "4.8",
    views: "740+",
    tagline: "Ancient powers reborn — a mythological action saga unlike anything you've seen.",
    poster: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
    firstPanel: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
    viewerUrl: "/viewer/6a6cb052b666434fc607cc3c-prana-english-chapter-1?start=0",
    detailsUrl: "/details/6a6cb052b666434fc607cc3c-prana-english-chapter-1",
  },
};

// Track funnel click to MongoDB behaviorlogs
const trackComicClick = (action, comicId, articleSlug) => {
  try {
    const userId = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon";
    fetch("/api/behavior/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        projectId: comicId,
        customAction: action,
        articleSlug: articleSlug || "unknown",
      }),
    }).catch(() => {});
  } catch (_) {}
};

/**
 * MidArticleSpotlight: High-impact inline comic card embedded in the article reading flow
 */
export const MidArticleSpotlight = ({ articleSlug, category }) => {
  const navigate = useNavigate();

  // Context-aware comic matching — keyed to article slug/category keywords
  // Ordered from most-specific to least-specific; first match wins.
  const slugLower = (articleSlug || "").toLowerCase();
  const catLower  = (category || "").toLowerCase();
  const context   = slugLower + " " + catLower;

  let comic = FEATURED_COMICS.karma;
  if (/prana|mythology|puraan|vedic|ancient|bhagavad|ramayan|mahabharat/.test(context)) {
    comic = FEATURED_COMICS.prana;
  } else if (/ghost|bhoot|horror|haunted|lootera|spooky|paranormal/.test(context)) {
    comic = FEATURED_COMICS.looteraBhoot;
  } else if (/chullu|comedy|parilok|celestial|funny|parody|swarg/.test(context)) {
    comic = FEATURED_COMICS.chullu;
  } else if (/sando|sci.?fi|science fiction|retro|futurist|mystery|robot|alien/.test(context)) {
    comic = FEATURED_COMICS.sando;
  } else {
    // Default: Karma — dark fantasy / action fits most anime/manga adjacent articles
    comic = FEATURED_COMICS.karma;
  }

  const handleReadClick = (e) => {
    e.preventDefault();
    trackComicClick("mid_article_comic_cta_clicked", comic.id, articleSlug);
    navigate(comic.viewerUrl);
  };

  const handleDetailsClick = () => {
    trackComicClick("mid_article_comic_details_clicked", comic.id, articleSlug);
  };

  return (
    <div className="mid-article-spotlight" id="mid-article-comic-card">
      <div className="spotlight-content">
        {/* Compact Comic Cover Thumbnail */}
        <div className="spotlight-poster-wrap" onClick={handleReadClick}>
          <img src={comic.poster} alt={comic.title} className="spotlight-poster" loading="lazy" />
          <div className="poster-play-overlay">
            <span>Read →</span>
          </div>
        </div>

        {/* Compact Comic Info */}
        <div className="spotlight-info">
          <div className="spotlight-top-micro">
            <span className="spotlight-badge-tag">🔥 Trending Comic</span>
            <span className="spotlight-genre">{comic.genre}</span>
            <span className="spotlight-rating">★ {comic.rating}</span>
          </div>

          <h4 className="spotlight-title">
            <Link to={comic.detailsUrl} onClick={handleDetailsClick}>
              {comic.title}
            </Link>
          </h4>

          <div className="spotlight-meta-sub">
            <span className="creator-text">By {comic.creator}</span>
            <span className="meta-sep">•</span>
            <span className="free-tag">✓ Free (No Login)</span>
          </div>

          <div className="spotlight-bottom-bar">
            <button className="spotlight-btn-read" onClick={handleReadClick}>
              <span>Read Free Issue 1</span>
              <span className="arrow-icon">→</span>
            </button>
            <Link to={comic.detailsUrl} className="spotlight-btn-details" onClick={handleDetailsClick}>
              Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * EndOfArticleShowcase: 3-comic recommendation carousel/grid after the article body
 */
export const EndOfArticleShowcase = ({ articleSlug }) => {
  const navigate = useNavigate();
  const showcaseList = [
    FEATURED_COMICS.karma,
    FEATURED_COMICS.chullu,
    FEATURED_COMICS.sando,
  ];

  const handleComicClick = (comic, action) => {
    trackComicClick(action, comic.id, articleSlug);
  };

  return (
    <section className="end-article-comic-showcase" aria-label="Recommended Indie Comics">
      <div className="showcase-header">
        <div className="header-left">
          <span className="showcase-eyebrow">ZealPlane Originals & Indie Exclusives</span>
          <h3 className="showcase-title">Loved This Story? Binge Original Indie Comics</h3>
        </div>
        <Link to="/" className="showcase-explore-link">
          Browse All Comics →
        </Link>
      </div>

      <div className="showcase-grid">
        {showcaseList.map((comic) => (
          <div key={comic.id} className="showcase-card">
            <div 
              className="showcase-card-cover"
              onClick={() => {
                handleComicClick(comic, "end_article_comic_cover_clicked");
                navigate(comic.viewerUrl);
              }}
            >
              <img src={comic.poster} alt={comic.title} loading="lazy" />
              <div className="cover-read-tag">Read Ch 1</div>
              <span className="cover-views-pill">👁️ {comic.views}</span>
            </div>

            <div className="showcase-card-body">
              <span className="comic-genre-tag">{comic.genre.split("·")[0]}</span>
              <h4 className="comic-card-title">{comic.title}</h4>
              <p className="comic-card-desc">{comic.tagline}</p>
              <p style={{ fontSize: "11px", color: "#ff8c00", fontWeight: "700", margin: "4px 0 8px", letterSpacing: "0.3px" }}>
                ✓ Free · No account needed
              </p>

              <div className="card-actions">
                <button
                  className="card-read-btn"
                  onClick={() => {
                    handleComicClick(comic, "end_article_comic_btn_clicked");
                    navigate(comic.viewerUrl);
                  }}
                >
                  Read Free →
                </button>
                <Link
                  to={comic.detailsUrl}
                  className="card-details-btn"
                  onClick={() => handleComicClick(comic, "end_article_comic_details_clicked")}
                >
                  Info
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default { MidArticleSpotlight, EndOfArticleShowcase };
