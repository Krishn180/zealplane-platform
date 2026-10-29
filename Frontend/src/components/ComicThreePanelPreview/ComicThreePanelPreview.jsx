import React from "react";
import { Link } from "react-router-dom";
import "./ComicThreePanelPreview.scss";

const COMIC_PREVIEWS = {
  karma: {
    id: "6a60d6370cb3db69eafea318",
    title: "KARMA",
    genre: "Dark Fantasy · Supernatural Action",
    tagline: "An unkillable warrior, a broken covenant, and an ancient debt of blood.",
    viewerUrl: "/viewer/6a60d6370cb3db69eafea318-karma?start=3",
    panels: [
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731197/comics/6a60d6370cb3db69eafea317/bihvleqow2savddn1v6m.jpg",
        caption: "1. The Awakening"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731198/comics/6a60d6370cb3db69eafea317/f6kjeji9vntiic0vyblg.jpg",
        caption: "2. The Encounter"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1784731197/comics/6a60d6370cb3db69eafea317/t4nxnaxca9nzf1wmxqjs.jpg",
        caption: "3. The Climax"
      }
    ]
  },
  ghost: {
    id: "6803a90bdab5a44638dc9f85",
    title: "Ghost in the Crowd",
    genre: "Psychological Thriller · Mystery",
    tagline: "He moves through the shadows unseen. But when death leaves a clue, the game begins.",
    viewerUrl: "/viewer/6803a90bdab5a44638dc9f85-ghost-in-the-crowd?start=3",
    panels: [
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1745070481/project_images/jqdp8leycc5jz42jjjvz.jpg",
        caption: "1. The Suspect"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1745070510/project_images/wtztc6a16wim94vzw7dx.jpg",
        caption: "2. The Pursuit"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1745070524/project_images/eohkvnbnvuwbwpc1mogc.jpg",
        caption: "3. The Dead End"
      }
    ]
  },
  prana: {
    id: "6a6cb052b666434fc607cc3c",
    title: "PRANA!",
    genre: "Mythological Action · Dark Sci-Fi",
    tagline: "Ancient cosmic energy dormant for ten thousand years awakens in modern India.",
    viewerUrl: "/viewer/6a6cb052b666434fc607cc3c-prana-english-chapter-1?start=3",
    panels: [
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507827/comics/prana/english_chapter1/page1.webp",
        caption: "1. The Prophecy"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507833/comics/prana/english_chapter1/page2.webp",
        caption: "2. The Surge"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507838/comics/prana/english_chapter1/page3.webp",
        caption: "3. The Awakening"
      }
    ]
  },
  chullu: {
    id: "6a770154adc3e27012ff8608",
    title: "Chullu Parilok Me",
    genre: "Nostalgic Supernatural Comedy",
    tagline: "Classic 90s nostalgia slapstick comedy by Swapnil Comics.",
    viewerUrl: "/viewer/6a770154adc3e27012ff8608-chullu-parilok-me?start=3",
    panels: [
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183993/project_images/j0rqwkjyiiurjypmmxdm.jpg",
        caption: "1. The Arrival"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183993/project_images/aunnfjqzwl3h71x4qrfu.jpg",
        caption: "2. The Mischief"
      },
      {
        url: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183995/project_images/zulaebhekiebaj2me8fm.jpg",
        caption: "3. The Chaos"
      }
    ]
  }
};

export const ComicThreePanelPreview = ({ articleSlug = "", category = "" }) => {
  const context = `${articleSlug || ""} ${category || ""}`.toLowerCase();

  // Pick comic based on genre psychology
  let comic = COMIC_PREVIEWS.karma;
  if (/psychological|mystery|detective|liar|ghost|death|mind/.test(context)) {
    comic = COMIC_PREVIEWS.ghost;
  } else if (/mythology|prana|god|ancient|bleach|dragon/.test(context)) {
    comic = COMIC_PREVIEWS.prana;
  } else if (/comedy|funny|humor|chullu|retro|parody/.test(context)) {
    comic = COMIC_PREVIEWS.chullu;
  } else {
    comic = COMIC_PREVIEWS.karma;
  }

  const handleTrackClick = () => {
    try {
      const userId = localStorage.getItem("Id") || localStorage.getItem("guestId") || "anon";
      fetch("/api/behavior/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          projectId: comic.id,
          customAction: "article_three_panel_comic_clicked",
          articleSlug: articleSlug || "unknown"
        })
      }).catch(() => {});
    } catch (_) {}
  };

  return (
    <section className="comic-three-panel-preview" aria-label="Quick Comic Preview">
      <div className="preview-top-bar">
        <span className="preview-eyebrow">
          <span className="pulse-dot"></span>
          4-MINUTE QUICK READ · ZEALPLANE ORIGINALS
        </span>
        <span className="preview-friction-pill">✓ Free · No Account Needed</span>
      </div>

      <div className="preview-header">
        <h3 className="preview-title">
          Got 4 minutes? Read the first 3 panels of <em>{comic.title}</em> right now:
        </h3>
        <p className="preview-tagline">{comic.tagline}</p>
      </div>

      {/* 3 Panels Row */}
      <div className="panels-container">
        {comic.panels.map((panel, idx) => (
          <div key={idx} className="panel-card">
            <div className="panel-image-wrapper">
              <img 
                src={panel.url} 
                alt={`${comic.title} Panel ${idx + 1}`} 
                className="panel-img"
                loading="lazy"
              />
              <span className="panel-step-badge">{panel.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion Bar under panel 3 */}
      <div className="preview-action-box">
        <Link 
          to={comic.viewerUrl} 
          className="preview-continue-btn"
          onClick={handleTrackClick}
        >
          <span>Continue Reading Chapter 1 Free →</span>
        </Link>
        <span className="preview-sub-note">
          Instant Vertical Reader · No downloads · Continue where you left off
        </span>
      </div>
    </section>
  );
};

export default ComicThreePanelPreview;
