import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Eye } from "lucide-react";
import axiosInstance from "../../Auth/Axios";
import "./LandingTrendingStrip.scss";

// Fallback images from local assets
import fb1 from "../../assets/aghori9.jpg";
import fb2 from "../../assets/dehek-eng.jpg";
import fb3 from "../../assets/sando.jpg";
import fb4 from "../../assets/chullu.jpg";
import fb5 from "../../assets/gameofdeath.jpg";
import fb6 from "../../assets/heroimge.jpg";

const fallbackComics = [
  { _id: "66e07afcd26cd9c9b5f54070", name: "Aghori", thumbnailImage: fb1, views: 2400, username: "KrishnaKumar" },
  { _id: "67b417e1b58fee068ef0be8e", name: "Chullu aur Lootera Bhoot", thumbnailImage: fb4, views: 1500, username: "AartiPrasad" },
  { _id: "6862054388b4ebf35001fba9", name: "Sando Ki Duniya", thumbnailImage: fb3, views: 3100, username: "Fictioncomics" },
  { _id: "684d4a3c88b4ebf3500120f7", name: "Pagla Dadu", thumbnailImage: fb3, views: 2800, username: "Fictioncomics" },
  { _id: "6a60d6370cb3db69eafea318", name: "Karma", thumbnailImage: fb5, views: 2700, username: "Prince" },
  { _id: "6803a90bdab5a44638dc9f85", name: "Ghost in the Crowd", thumbnailImage: fb6, views: 2100, username: "KrishnaKumar" },
];

const LandingTrendingStrip = () => {
  const navigate = useNavigate();
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const stripRef = useRef(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const res = await axiosInstance.get("/projects");
        const projects = res.data?.projects || res.data || [];
        if (Array.isArray(projects) && projects.length > 0) {
          // Sort by views descending, take top 12
          const sorted = [...projects]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 12);
          setComics(sorted);
        } else {
          setComics(fallbackComics);
        }
      } catch {
        setComics(fallbackComics);
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, []);

  const slugify = (text) => {
    const clean = (text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return clean || "comic";
  };

  const handleClick = (comic) => {
    const id = comic.projectId || comic._id;
    if (id) navigate(`/viewer/${id}-${slugify(comic.name)}`);
  };

  const handleDetailsClick = (e, comic) => {
    e.stopPropagation();
    const id = comic.projectId || comic._id;
    if (id) navigate(`/details/${id}-${slugify(comic.name)}`);
  };

  // Duplicate comics for seamless infinite scroll
  const displayComics = comics.length > 0 ? [...comics, ...comics] : [];

  return (
    <section className="lts-root" aria-label="Trending Comics">
      <div className="lts-header">
        <h2 className="lts-title">
          <Flame size={20} className="lts-fire" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }} />
          Trending on ZealPlane
        </h2>
        <p className="lts-subtitle">The most-read comics this week — dive in, no login needed</p>
      </div>

      <div
        className="lts-track-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        ref={stripRef}
      >
        {loading ? (
          <div className="lts-skeletons">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="lts-skeleton-card">
                <div className="lts-skeleton-img" />
                <div className="lts-skeleton-text" />
                <div className="lts-skeleton-sub" />
              </div>
            ))}
          </div>
        ) : (
          <div className={`lts-track ${isPaused ? "lts-paused" : ""}`}>
            {displayComics.map((comic, i) => {
              const isCloned = i >= comics.length;
              return (
              <div
                key={`${comic._id}-${i}`}
                className="lts-card"
                onClick={() => handleClick(comic)}
                role="button"
                tabIndex={isCloned ? -1 : 0}
                aria-hidden={isCloned ? "true" : undefined}
                data-nosnippet={isCloned ? "true" : undefined}
                aria-label={`Read ${comic.name}`}
              >
                <div className="lts-card-poster">
                  <img
                    src={comic.thumbnailImage || comic.thumbnailImages?.[0]}
                    alt={comic.name}
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="lts-card-overlay">
                    <span className="lts-card-read">Read Now →</span>
                  </div>
                  {(comic.views || 0) > 0 && (
                    <div className="lts-card-views">
                      <Eye size={12} style={{ marginRight: "4px", display: "inline-block", verticalAlign: "middle" }} />
                      {comic.views >= 1000 ? `${(comic.views / 1000).toFixed(1)}k` : comic.views}
                    </div>
                  )}
                </div>
                <div className="lts-card-info">
                  <h3 className="lts-card-title">{comic.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3px" }}>
                    <span className="lts-card-creator">
                      by {comic.username || comic.creatorName || "ZealPlane Creator"}
                    </span>
                    <span 
                      onClick={(e) => handleDetailsClick(e, comic)}
                      title="View Details & Comments"
                      style={{
                        fontSize: "10.5px",
                        color: "#94a3b8",
                        background: "rgba(255, 255, 255, 0.08)",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      💬 Info
                    </span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingTrendingStrip;
