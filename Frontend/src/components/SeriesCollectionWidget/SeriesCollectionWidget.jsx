import React from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaChevronRight, FaStar, FaFire } from "react-icons/fa";
import "./SeriesCollectionWidget.scss";

// Hardcoded or dynamically matched Series Maps for Chullu, Sando, Pagla Dadu, Khaufnaak Kisse
const SERIES_MAP = {
  chullu: {
    title: "Chullu Comic Series",
    author: "Krishna",
    badge: "🔥 Official Comedy Series",
    description: "Follow the hilarious antics and mischievous pranks of Chullu in this nostalgic retro Indian comic collection!",
    issues: [
      {
        id: "67b417e1b58fee068ef0be8d",
        name: "Chullu aur Lootera Bhoot",
        slug: "chullu-aur-lootera-bhoot",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1739864030/project_images/i01ey0lqnh15g399e52y.jpg",
        issueNum: "Issue #1"
      },
      {
        id: "67c4765dadc64b57787ae6a4",
        name: "Chullu aur Khadoos uncle",
        slug: "chullu-aur-khadoos-uncle",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1740928604/project_images/y8pv4emvq8vfprm2giuv.jpg",
        issueNum: "Issue #2"
      },
      {
        id: "6a770154adc3e27012ff8608",
        name: "Chullu Parilok Me",
        slug: "chullu-parilok-me",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg",
        issueNum: "Issue #3"
      }
    ]
  },
  sando: {
    title: "Sando ki Duniya Series",
    author: "DRC Studio & Sushant Panda",
    badge: "⭐ Popular Hindi Comic Series",
    description: "The hilarious misadventures and quirky gags of Sando, a uniquely lovable hero!",
    issues: [
      {
        id: "6862054388b4ebf35001fba9",
        name: "Sando ki duniya",
        slug: "sando-ki-duniya",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1755018691/project_images/1755018689449-sando.jpg",
        issueNum: "Ch 1-4 (Live)"
      },
      {
        id: "689b75c3841e0e7c176cf279",
        name: "Sando ke naye kaarnaame",
        slug: "sando-ke-naye-kaarnaame",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1755018691/project_images/1755018689449-sando.jpg",
        issueNum: "Issue #2"
      },
      {
        id: "68e68628d3f27884af359000",
        name: "Sando #1 (English)",
        slug: "sando-1-english",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1759938087/project_images/1759938086157-sando.jpg",
        issueNum: "English Edition"
      }
    ]
  },
  dadu: {
    title: "Pagla Dadu ke Kaarnaame",
    author: "Fiction Comics",
    badge: "⭐ Classic Comedy",
    description: "Classic retro digest comedy featuring the eccentric Pagla Dadu!",
    issues: [
      {
        id: "684d4a3c88b4ebf3500120f7",
        name: "Pagla Dadu",
        slug: "pagla-dadu",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1749895740/project_images/eqehtwnaodvkwfwkswki.jpg",
        issueNum: "Issue #1 (Complete)"
      },
      {
        id: "6862177c99fa95d08709ecb2",
        name: "Pagla Dadu ke Naye Karnamen",
        slug: "pagla-dadu-ke-naye-karnamen",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1751259004/project_images/1751259002381-DADU.jpg",
        issueNum: "Issue #2"
      }
    ]
  },
  prana: {
    title: "PRANA Master Series",
    author: "ZealPlane Originals",
    badge: "⚡ Dark Action Fantasy",
    description: "A dark high-stakes action fantasy series exploring ancient life-force energy, divine weapons, and mystical battles!",
    issues: [
      {
        id: "6a6cb052b666434fc607cc3c",
        name: "PRANA (English) - Chapter 1",
        slug: "prana-english---chapter-1",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
        issueNum: "Chapter 1"
      },
      {
        id: "6a6cb0beb666434fc607cc3f",
        name: "PRANA (English) - Chapter 2",
        slug: "prana-english---chapter-2",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
        issueNum: "Chapter 2"
      },
      {
        id: "6a6cb109b666434fc607cc42",
        name: "PRANA (English) - Chapter 3",
        slug: "prana-english---chapter-3",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
        issueNum: "Chapter 3"
      },
      {
        id: "6a6cb199b666434fc607cc45",
        name: "PRANA (English) - Chapter 4",
        slug: "prana-english---chapter-4",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
        issueNum: "Chapter 4"
      },
      {
        id: "6a6cb24bb666434fc607cc48",
        name: "PRANA (English) - Chapter 5",
        slug: "prana-english---chapter-5",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp",
        issueNum: "Chapter 5"
      }
    ]
  },
  pepper: {
    title: "Pepper & Carrot Series",
    author: "David Revoy",
    badge: "🌟 Open Source Classic",
    description: "Follow the magical adventures of young witch Pepper and her cat Carrot in the magical world of Hereva!",
    issues: [
      {
        id: "6a6cdec4ee05704e7d7c149f",
        name: "Pepper & Carrot - Ep 1: The Potion of Flight",
        slug: "pepper-carrot---episode-1-the-potion-of-flight",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785519045/comics/peppercarrot/episode1/page0.jpg",
        issueNum: "Episode 1"
      },
      {
        id: "6a6cdecbee05704e7d7c14a2",
        name: "Pepper & Carrot - Ep 2: Rainbow Potions",
        slug: "pepper-carrot---episode-2-rainbow-potions",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785519050/comics/peppercarrot/episode2/page0.jpg",
        issueNum: "Episode 2"
      },
      {
        id: "6a6cdf6542b2c55cd04b909d",
        name: "Pepper & Carrot - Ep 3: The Secret Ingredients",
        slug: "pepper-carrot---episode-3-the-secret-ingredients",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785519968/comics/peppercarrot/episode3/page0.jpg",
        issueNum: "Episode 3"
      },
      {
        id: "6a6cdf6a42b2c55cd04b90a1",
        name: "Pepper & Carrot - Ep 4: Stroke of Genius",
        slug: "pepper-carrot---episode-4-stroke-of-genius",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785519973/comics/peppercarrot/episode4/page0.jpg",
        issueNum: "Episode 4"
      },
      {
        id: "6ac30c3b8010cd18701d3c99",
        name: "Pepper & Carrot - Ep 5: Special Holiday Episode",
        slug: "pepper-carrot---episode-5-special-holiday-episode",
        cover: "https://www.zealplane.com/comics/peppercarrot/episode5/page0.jpg",
        issueNum: "Episode 5"
      },
      {
        id: "6a6cdf7642b2c55cd04b90a5",
        name: "Pepper & Carrot - Ep 6: The Potion Contest",
        slug: "pepper-carrot---episode-6-the-potion-contest",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785519978/comics/peppercarrot/episode6/page0.jpg",
        issueNum: "Episode 6"
      },
      {
        id: "6a6d8641580dc676bbc5f538",
        name: "Pepper & Carrot - Ep 7: The Wish",
        slug: "pepper-carrot---episode-7-the-wish",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785562686/comics/peppercarrot/episode7/page0.jpg",
        issueNum: "Episode 7"
      },
      {
        id: "6a6d8646580dc676bbc5f53c",
        name: "Pepper & Carrot - Ep 8: Pepper's Birthday Party",
        slug: "pepper-carrot---episode-8-peppers-birthday-party",
        cover: "https://res.cloudinary.com/datgyuhmy/image/upload/v1785562690/comics/peppercarrot/episode8/page0.jpg",
        issueNum: "Episode 8"
      },
      {
        id: "6ac30c775abda44981684c2c",
        name: "Pepper & Carrot - Ep 9: The Remedy",
        slug: "pepper-carrot---episode-9-the-remedy",
        cover: "https://www.zealplane.com/comics/peppercarrot/episode9/page0.jpg",
        issueNum: "Episode 9"
      },
      {
        id: "6ac30e8550b88a0bb67f7127",
        name: "Pepper & Carrot - Ep 10: Summer Special",
        slug: "pepper-carrot---episode-10-summer-special",
        cover: "https://www.zealplane.com/comics/peppercarrot/episode10/page0.jpg",
        issueNum: "Episode 10"
      }
    ]
  }
};

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const SeriesCollectionWidget = ({ currentProjectName, currentProjectId }) => {
  if (!currentProjectName) return null;

  const lowerName = currentProjectName.toLowerCase();
  let selectedSeriesKey = null;

  if (lowerName.includes("chullu")) {
    selectedSeriesKey = "chullu";
  } else if (lowerName.includes("sando")) {
    selectedSeriesKey = "sando";
  } else if (lowerName.includes("dadu")) {
    selectedSeriesKey = "dadu";
  } else if (lowerName.includes("prana")) {
    selectedSeriesKey = "prana";
  } else if (lowerName.includes("pepper") || lowerName.includes("carrot")) {
    selectedSeriesKey = "pepper";
  }

  if (!selectedSeriesKey) return null;

  const series = SERIES_MAP[selectedSeriesKey];
  const currentIssueIndex = series.issues.findIndex(
    (issue) => currentProjectId && (currentProjectId.includes(issue.id) || issue.id.includes(currentProjectId))
  );

  const nextIssue = currentIssueIndex !== -1 && currentIssueIndex < series.issues.length - 1
    ? series.issues[currentIssueIndex + 1]
    : (series.issues.length > 1 ? series.issues[0] : null);

  return (
    <div className="series-collection-widget">
      <div className="series-header">
        <div className="series-title-area">
          <span className="series-badge"><FaFire /> {series.badge}</span>
          <h2>{series.title}</h2>
          <p className="series-author">By {series.author}</p>
        </div>
      </div>

      <p className="series-description">{series.description}</p>

      {/* Issues Timeline Grid */}
      <div className="series-issues-grid">
        {series.issues.map((issue, idx) => {
          const isCurrent = currentProjectId && (currentProjectId.includes(issue.id) || issue.id.includes(currentProjectId));
          return (
            <Link
              key={issue.id}
              to={`/details/${issue.id}-${slugify(issue.name)}`}
              className={`series-issue-card ${isCurrent ? "active-issue" : ""}`}
            >
              <div className="issue-cover-wrapper">
                <img src={issue.cover} alt={issue.name} loading="lazy" />
                <span className="issue-number">{issue.issueNum}</span>
                {isCurrent && <span className="reading-now-badge">Reading Now</span>}
              </div>
              <div className="issue-info">
                <h4>{issue.name}</h4>
                <span className="read-btn-sm">
                  {isCurrent ? "Current Issue" : "Read Issue"} <FaChevronRight size={10} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Hook CTA for Next Issue */}
      {nextIssue && nextIssue.id !== currentProjectId && (
        <div className="series-next-cta">
          <div className="cta-content">
            <span className="cta-tag">Up Next in Series</span>
            <h3>{nextIssue.name}</h3>
          </div>
          <Link
            to={`/details/${nextIssue.id}-${slugify(nextIssue.name)}`}
            className="btn-next-issue"
          >
            <FaBookOpen /> Read Next Issue <FaChevronRight />
          </Link>
        </div>
      )}
    </div>
  );
};

export default SeriesCollectionWidget;
