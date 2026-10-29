import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaTv, 
  FaBookOpen, 
  FaExternalLinkAlt, 
  FaCommentDots, 
  FaSearch, 
  FaChevronDown,
  FaChevronUp,
  FaCompass
} from "react-icons/fa";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Footer from "../../components/footer/Footer";
import "./MangaReleaseCalendar.scss";

// --- WEEKLY SERIALIZATION SCHEDULE TRACKER (IST) ---
const MANGA_RELEASES = [
  {
    id: "one-piece",
    title: "One Piece",
    creator: "Eiichiro Oda",
    category: "manga",
    nextChapter: "Chapter 1192",
    day: "Sundays",
    timeIST: "8:30 PM IST",
    publisher: "Shueisha (MANGA Plus / VIZ)",
    rawLeaks: "Wednesdays & Thursdays (Scan leaks circulate 3–4 days prior)",
    arc: "Elbaf Kingdom Arc",
    status: "Active Weekly",
    officialLink: "https://mangaplus.shueisha.co.jp/titles/100020",
    summary: "The Straw Hat Pirates journey through the legendary giant kingdom of Elbaf as the Final Saga mysteries deepen."
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    creator: "Tatsuki Fujimoto",
    category: "manga",
    nextChapter: "Chapter 198",
    day: "Tuesdays (Bi-weekly / Weekly)",
    timeIST: "8:30 PM IST",
    publisher: "Shueisha (Shonen Jump+ / MANGA Plus)",
    rawLeaks: "Tuesdays 5:00 PM IST",
    arc: "War Devil & Reze Climax",
    status: "Active",
    officialLink: "https://mangaplus.shueisha.co.jp/titles/100037",
    summary: "Denji faces escalating apocalyptic tensions as the War Devil unleashes chaos and familiar faces return."
  },
  {
    id: "kagurabachi",
    title: "Kagurabachi",
    creator: "Takeru Hokazono",
    category: "manga",
    nextChapter: "Chapter 74",
    day: "Sundays",
    timeIST: "8:30 PM IST",
    publisher: "Weekly Shonen Jump / MANGA Plus",
    rawLeaks: "Thursdays 11:00 AM IST",
    arc: "Enchanted Blades War",
    status: "Active Weekly",
    officialLink: "https://mangaplus.shueisha.co.jp/titles/100274",
    summary: "Chihiro Rokuhira wields the enchanted katana forged by his late father to combat the sorcery syndicate Hishaku."
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling: Ragnarok",
    creator: "Redice Studio / Chugong",
    category: "webtoon",
    nextChapter: "Weekly Episode",
    day: "Wednesdays",
    timeIST: "10:30 PM IST",
    publisher: "KakaoPage / Webtoon",
    rawLeaks: "Wednesdays 7:00 PM IST (Korean raws)",
    arc: "Shadow Monarch Lineage",
    status: "Active Weekly",
    officialLink: "https://www.webtoons.com",
    summary: "Sung Suho awakens his dormant Shadow Monarch lineage as primordial monarchs threaten Earth once more."
  },
  {
    id: "boruto",
    title: "Boruto: Two Blue Vortex",
    creator: "Masashi Kishimoto / Mikio Ikemoto",
    category: "manga",
    nextChapter: "Chapter 20",
    day: "20th of Every Month",
    timeIST: "8:30 PM IST",
    publisher: "V-Jump / MANGA Plus",
    rawLeaks: "16th–18th of each month",
    arc: "Shinju God Tree Invasions",
    status: "Monthly",
    officialLink: "https://mangaplus.shueisha.co.jp/titles/100269",
    summary: "Timeskip Boruto uses Flying Raijin and Uzuhiko against sentient God Tree clones threatening Konoha."
  },
  {
    id: "sando",
    title: "Sando ki Duniya",
    creator: "Fiction Publication / DRC Studio",
    category: "zealplane",
    nextChapter: "Available to Read",
    day: "Weekly Catalog Drop",
    timeIST: "Sunday Evenings",
    publisher: "ZealPlane Exclusive",
    rawLeaks: "Official Digital Catalog",
    arc: "Bharat Comedy Adventures",
    status: "Free to Read",
    projectId: "6862054388b4ebf35001fba8",
    isZealPlane: true,
    summary: "Relatable, lighthearted Indian comedy following Sando and his quirky misadventures in Bharat."
  },
  {
    id: "karma",
    title: "Karma",
    creator: "Krishna Kumar",
    category: "zealplane",
    nextChapter: "Chapters 1–4 Available",
    day: "Indie Showcase",
    timeIST: "Vault Access Live",
    publisher: "ZealPlane Exclusive",
    rawLeaks: "Exclusive Creator Vault",
    arc: "Shattering of Cosmic Scales",
    status: "Popular Indie Hit",
    projectId: "6a60d6370cb3db69eafea318",
    isZealPlane: true,
    summary: "When a soul bearing an unpayable weight of sin enters the realm, the cosmic scales of Karma shatter."
  }
];

// --- INDIA ANIME STREAMING & HINDI DUBS DIRECTORY ---
const ANIME_STREAMING = [
  {
    title: "Demon Slayer: Kimetsu no Yaiba",
    platforms: ["Crunchyroll India", "Netflix"],
    dubs: ["Hindi", "Tamil", "Telugu", "English", "Japanese"],
    hasHindiDub: true,
    highlight: "Full Hindi, Tamil & Telugu dubs available on Crunchyroll and Netflix. Infinity Castle trilogy announced for theatres.",
    genres: "Supernatural, Action"
  },
  {
    title: "Jujutsu Kaisen",
    platforms: ["Crunchyroll India", "Netflix"],
    dubs: ["Hindi (Crunchyroll)", "English", "Japanese"],
    hasHindiDub: true,
    highlight: "Seasons 1 & 2 plus JJK 0 movie streaming. Official Hindi dub available on Crunchyroll India.",
    genres: "Dark Fantasy, Shonen"
  },
  {
    title: "Solo Leveling",
    platforms: ["Crunchyroll India"],
    dubs: ["Hindi (Official)", "Tamil", "English", "Japanese"],
    hasHindiDub: true,
    highlight: "Official dedicated Hindi dub streaming exclusively on Crunchyroll India. Season 2 announced.",
    genres: "Action, Fantasy"
  },
  {
    title: "One Piece",
    platforms: ["Netflix India", "Crunchyroll India", "Muse India (YouTube)"],
    dubs: ["Japanese", "English (Netflix select arcs)"],
    hasHindiDub: false,
    highlight: "Egghead Island Arc simulcasts on Netflix India and Crunchyroll India every week.",
    genres: "Adventure, Shonen"
  },
  {
    title: "Attack on Titan",
    platforms: ["Crunchyroll India", "Netflix India"],
    dubs: ["Japanese", "English"],
    hasHindiDub: false,
    highlight: "Complete collection from Season 1 to 'The Final Chapters' available in HD uncut.",
    genres: "Dark Fantasy, Action"
  },
  {
    title: "Chainsaw Man",
    platforms: ["Crunchyroll India", "Netflix India"],
    dubs: ["Japanese", "English"],
    hasHindiDub: false,
    highlight: "Season 1 streaming in HD. The Reze Arc movie has been officially announced.",
    genres: "Action, Dark Fantasy"
  },
  {
    title: "Naruto & Naruto Shippuden",
    platforms: ["Netflix India", "JioCinema", "Sony YAY!"],
    dubs: ["Hindi Dub (JioCinema / Sony YAY!)", "English", "Japanese"],
    hasHindiDub: true,
    highlight: "All 500+ Shippuden episodes on Netflix. Selected Hindi-dubbed arcs streaming on JioCinema.",
    genres: "Ninja, Shonen"
  },
  {
    title: "Bleach: Thousand-Year Blood War",
    platforms: ["Disney+ Hotstar"],
    dubs: ["Japanese", "English"],
    hasHindiDub: false,
    highlight: "Exclusive streaming home for Bleach TYBW Part 1, 2, and 3 in India.",
    genres: "Supernatural, Action"
  },
  {
    title: "Dragon Ball Super & Z",
    platforms: ["Crunchyroll India", "JioCinema"],
    dubs: ["Hindi Dub (DB Super on Crunchyroll)", "English", "Japanese"],
    hasHindiDub: true,
    highlight: "Dragon Ball Super has a dedicated Hindi dub available on Crunchyroll India.",
    genres: "Martial Arts, Action"
  },
  {
    title: "Spy x Family",
    platforms: ["Netflix India", "Crunchyroll India", "Muse India (YouTube)"],
    dubs: ["Hindi Dub (Muse India YouTube)", "English", "Japanese"],
    hasHindiDub: true,
    highlight: "Watch episodes with official Hindi dubs on Muse India YouTube, or stream on Netflix.",
    genres: "Comedy, Action"
  },
  {
    title: "Death Note",
    platforms: ["Netflix India", "Amazon Prime Video"],
    dubs: ["English", "Japanese"],
    hasHindiDub: false,
    highlight: "Entire 37-episode psychological thriller masterpiece available in HD uncut.",
    genres: "Psychological, Mystery"
  },
  {
    title: "Dandadan",
    platforms: ["Netflix India", "Crunchyroll India"],
    dubs: ["Japanese", "English"],
    hasHindiDub: false,
    highlight: "Science SARU's hit supernatural comedy anime streaming globally in India.",
    genres: "Supernatural, Comedy"
  }
];

// --- SEO FAQ DATA ---
const FAQ_ITEMS = [
  {
    q: "When does One Piece release new chapters in IST?",
    a: "One Piece chapters release officially on Sundays at 8:30 PM IST on MANGA Plus by Shueisha and VIZ Media. Raw scan leaks typically circulate 3–4 days earlier between Wednesday and Thursday."
  },
  {
    q: "When does Chainsaw Man release new chapters in India?",
    a: "Chainsaw Man chapters release every Tuesday (or bi-weekly depending on the serialization schedule) at 8:30 PM IST on Shonen Jump+ and MANGA Plus."
  },
  {
    q: "Where can I watch anime with Hindi dub legally in India?",
    a: "Major legal anime streaming platforms with Hindi dubs include Crunchyroll India (Demon Slayer, Jujutsu Kaisen, Solo Leveling, Dragon Ball Super), Netflix India (Demon Slayer), JioCinema (Naruto), and Muse India on YouTube (Spy x Family)."
  },
  {
    q: "When does Solo Leveling: Ragnarok release new chapters?",
    a: "Solo Leveling: Ragnarok webtoon chapters release weekly every Wednesday at 10:30 PM IST on KakaoPage and Webtoon."
  },
  {
    q: "How do I read Indian indie comics on ZealPlane?",
    a: "You can explore ZealPlane's digital catalog anytime for titles like 'Karma' by Magha Studio, 'Sando ki Duniya', 'Ghost in the Crowd', and 'Chullu aur Lootera Bhoot'."
  }
];

const MangaReleaseCalendar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [streamFilter, setStreamFilter] = useState("all");
  const [streamSearch, setStreamSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const openMimirWithQuery = (query) => {
    window.dispatchEvent(new CustomEvent("openMimir", { detail: { query } }));
  };

  const openMimirAction = (action, payload) => {
    window.dispatchEvent(new CustomEvent("openMimir", { detail: { action, payload } }));
  };

  const filteredReleases = MANGA_RELEASES.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  const filteredAnime = ANIME_STREAMING.filter((anime) => {
    const matchesSearch = 
      anime.title.toLowerCase().includes(streamSearch.toLowerCase()) ||
      anime.platforms.some(p => p.toLowerCase().includes(streamSearch.toLowerCase())) ||
      anime.genres.toLowerCase().includes(streamSearch.toLowerCase());
    
    if (!matchesSearch) return false;

    if (streamFilter === "all") return true;
    if (streamFilter === "hindi_dub") return anime.hasHindiDub;
    return anime.platforms.some(p => p.toLowerCase().includes(streamFilter.toLowerCase()));
  });

  // Schema.org JSON-LD structured data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "name": "Manga & Anime Chapter Release Calendar (IST) 2026",
        "description": "Weekly release schedule in Indian Standard Time (IST) for top manga, webtoons, and ZealPlane indie comics.",
        "itemListElement": MANGA_RELEASES.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": `${item.title} - ${item.nextChapter}`,
          "description": `${item.title} releases on ${item.day} at ${item.timeIST} via ${item.publisher}.`
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  };

  return (
    <div className="zeal-calendar-page">
      <Helmet>
        <title>Manga & Anime Chapter Release Calendar (IST) — Weekly Tracker | ZealPlane</title>
        <meta 
          name="description" 
          content="Track weekly manga & anime chapter release timings in Indian Standard Time (IST). Official schedules for One Piece, Chainsaw Man, Solo Leveling, plus legal Hindi dub streaming guide." 
        />
        <link rel="canonical" href="https://www.zealplane.com/manga-release-calendar" />
        <meta property="og:title" content="Manga & Anime Chapter Release Calendar (IST) | ZealPlane" />
        <meta property="og:description" content="Check weekly manga release timings in IST and legal anime streaming platforms with Hindi dubs in India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.zealplane.com/manga-release-calendar" />
        <meta property="og:image" content="https://www.zealplane.com/assets/logoZP-31425837.png" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      <ContentWrapper>
        {/* Breadcrumb & Section Header */}
        <div className="calendar-header-section">
          <div className="header-breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Release Calendar</span>
          </div>

          <div className="header-meta-row">
            <span className="pulse-pill">
              <span className="pulse-dot"></span> WEEKLY INDUSTRY SCHEDULE (IST)
            </span>
          </div>

          <h1 className="main-heading">
            Manga & Anime Chapter <span className="text-accent">Release Schedule</span>
          </h1>
          <p className="main-subheading">
            Verified Indian Standard Time (IST) publication windows for popular weekly manga serializations, 
            Korean webtoons, and legal Indian OTT streaming availability with regional Hindi dubs.
          </p>

          {/* Action Anchors */}
          <div className="header-anchors">
            <a href="#schedule-table" className="anchor-btn primary">
              <FaCalendarAlt /> Weekly Serialization Table
            </a>
            <a href="#anime-streaming" className="anchor-btn secondary">
              <FaTv /> India Streaming Guide
            </a>
            <button onClick={() => openMimirAction("start_quiz")} className="anchor-btn tertiary">
              <FaCompass /> "What Should I Read?" Quiz
            </button>
          </div>
        </div>

        {/* Schedule Section */}
        <section id="schedule-table" className="calendar-content-section">
          <div className="section-title-wrap">
            <h2>Weekly Chapter Serialization Tracker (IST)</h2>
            <p>Official release windows verified across Shueisha, VIZ Media, KakaoPage, and Indian creators.</p>
          </div>

          {/* Category Tabs */}
          <div className="filter-tabs-bar">
            <button 
              className={`filter-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Tracked Titles ({MANGA_RELEASES.length})
            </button>
            <button 
              className={`filter-tab ${activeTab === "manga" ? "active" : ""}`}
              onClick={() => setActiveTab("manga")}
            >
              Shonen Jump Manga
            </button>
            <button 
              className={`filter-tab ${activeTab === "webtoon" ? "active" : ""}`}
              onClick={() => setActiveTab("webtoon")}
            >
              Webtoons
            </button>
            <button 
              className={`filter-tab ${activeTab === "zealplane" ? "active" : ""}`}
              onClick={() => setActiveTab("zealplane")}
            >
              ZealPlane Indian Originals
            </button>
          </div>

          {/* Schedule Table / Cards */}
          <div className="schedule-cards-list">
            {filteredReleases.map((manga) => (
              <div key={manga.id} className={`schedule-item-card ${manga.isZealPlane ? "zp-original" : ""}`}>
                <div className="item-header-row">
                  <div className="title-block">
                    <span className="category-tag">{manga.category.toUpperCase()}</span>
                    <h3 className="title-text">{manga.title}</h3>
                    <span className="creator-text">By {manga.creator}</span>
                  </div>

                  <div className="timing-block">
                    <span className="time-badge">
                      <FaClock size={11} /> {manga.timeIST}
                    </span>
                    <span className="day-badge">{manga.day}</span>
                  </div>
                </div>

                <div className="item-details-grid">
                  <div className="detail-col">
                    <span className="label">Upcoming Chapter</span>
                    <span className="val highlight">{manga.nextChapter}</span>
                  </div>
                  <div className="detail-col">
                    <span className="label">Official Publisher</span>
                    <span className="val">{manga.publisher}</span>
                  </div>
                  <div className="detail-col">
                    <span className="label">Raw Leaks Timeline</span>
                    <span className="val leak-note">{manga.rawLeaks}</span>
                  </div>
                  <div className="detail-col">
                    <span className="label">Current Story Arc</span>
                    <span className="val">{manga.arc}</span>
                  </div>
                </div>

                <p className="item-summary">{manga.summary}</p>

                <div className="item-footer-actions">
                  {manga.isZealPlane ? (
                    <button 
                      className="action-btn zp-read"
                      onClick={() => navigate(`/viewer/${manga.projectId}`)}
                    >
                      <FaBookOpen /> Read on ZealPlane
                    </button>
                  ) : (
                    <a 
                      href={manga.officialLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="action-btn official"
                    >
                      <FaExternalLinkAlt size={11} /> Read on Official Source
                    </a>
                  )}

                  <button 
                    className="action-btn mimir"
                    onClick={() => openMimirWithQuery(`What is the latest chapter status and release time for ${manga.title}?`)}
                  >
                    <FaCommentDots /> Ask Mimir About {manga.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Anime Streaming Guide Section */}
        <section id="anime-streaming" className="calendar-content-section streaming-section">
          <div className="section-title-wrap">
            <h2>Where to Watch Anime in India (OTT & Dubs Guide)</h2>
            <p>Verified streaming platforms in India with official Hindi, Tamil, and Telugu dub availability.</p>
          </div>

          {/* Search & Platform Filter */}
          <div className="streaming-filter-toolbar">
            <div className="search-input-wrap">
              <FaSearch className="search-ico" />
              <input 
                type="text" 
                placeholder="Search anime by title (e.g. Demon Slayer, Solo Leveling, JJK)..."
                value={streamSearch}
                onChange={(e) => setStreamSearch(e.target.value)}
              />
            </div>

            <div className="filter-chips-row">
              <button 
                className={`chip ${streamFilter === "all" ? "active" : ""}`}
                onClick={() => setStreamFilter("all")}
              >
                All Anime
              </button>
              <button 
                className={`chip ${streamFilter === "hindi_dub" ? "active" : ""}`}
                onClick={() => setStreamFilter("hindi_dub")}
              >
                🎙️ Hindi Dubbed
              </button>
              <button 
                className={`chip ${streamFilter === "crunchyroll" ? "active" : ""}`}
                onClick={() => setStreamFilter("crunchyroll")}
              >
                Crunchyroll
              </button>
              <button 
                className={`chip ${streamFilter === "netflix" ? "active" : ""}`}
                onClick={() => setStreamFilter("netflix")}
              >
                Netflix
              </button>
              <button 
                className={`chip ${streamFilter === "jiocinema" ? "active" : ""}`}
                onClick={() => setStreamFilter("jiocinema")}
              >
                JioCinema
              </button>
            </div>
          </div>

          {/* Anime Grid */}
          <div className="anime-cards-grid">
            {filteredAnime.map((anime, idx) => (
              <div key={idx} className="anime-item-card">
                <div className="card-top">
                  <h3>{anime.title}</h3>
                  <span className="genres-label">{anime.genres}</span>
                </div>

                <div className="meta-group">
                  <span className="meta-label">Available Platforms</span>
                  <div className="badge-wrap">
                    {anime.platforms.map((plat, pIdx) => (
                      <span key={pIdx} className="platform-badge">{plat}</span>
                    ))}
                  </div>
                </div>

                <div className="meta-group">
                  <span className="meta-label">Regional Audio</span>
                  <div className="badge-wrap">
                    {anime.dubs.map((dub, dIdx) => (
                      <span key={dIdx} className={`dub-badge ${dub.toLowerCase().includes("hindi") ? "hindi-tag" : ""}`}>
                        {dub}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="anime-note">{anime.highlight}</p>

                <button 
                  className="ask-stream-btn"
                  onClick={() => openMimirWithQuery(`Where can I watch ${anime.title} in India and does it have a Hindi dub?`)}
                >
                  <FaCommentDots /> Ask Mimir About {anime.title}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Mimir Assistant Banner */}
        <section className="mimir-feature-banner">
          <div className="banner-left">
            <span className="mimir-emoji">🔮</span>
            <div>
              <h3>Have questions about a chapter or what to read next?</h3>
              <p>Mimir, our tavern guide, tracks chapter releases, checks Hindi streaming availability, and recommends Indian indie comics.</p>
            </div>
          </div>
          <div className="banner-right">
            <button onClick={() => openMimirAction("release_calendar")} className="btn-mimir-primary">
              <FaCalendarAlt /> Check Weekly Schedule
            </button>
            <button onClick={() => openMimirAction("start_quiz")} className="btn-mimir-secondary">
              <FaCompass /> Recommendation Quiz
            </button>
          </div>
        </section>

        {/* SEO FAQ Accordion */}
        <section className="calendar-content-section faq-section">
          <div className="section-title-wrap">
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common questions regarding weekly manga serialization and anime streaming in India.</p>
          </div>

          <div className="faq-accordion-list">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-row ${isOpen ? "open" : ""}`}>
                  <button 
                    className="faq-toggle-btn"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer Crosslinks to ZealPlane Comics */}
        <section className="zeal-crosslink-block">
          <h3>Explore Original Indian Comics on ZealPlane</h3>
          <p>Read compelling indie webcomics from Indian creators, available free on ZealPlane.</p>
          <div className="crosslink-row">
            <Link to="/viewer/6a60d6370cb3db69eafea318" className="cross-pill">Read 'Karma' by Krishna Kumar</Link>
            <Link to="/viewer/6862054388b4ebf35001fba9" className="cross-pill">Read 'Sando ki Duniya'</Link>
            <Link to="/viewer/6a770154adc3e27012ff8608" className="cross-pill">Read 'Chullu Parilok Me'</Link>
          </div>
        </section>
      </ContentWrapper>
      <Footer />
    </div>
  );
};

export default MangaReleaseCalendar;
