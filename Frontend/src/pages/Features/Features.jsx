import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../../AboutCard/Navbar";
import Footer from "../../components/footer/Footer";
import { 
  BookOpen, 
  Scissors, 
  Calendar, 
  Languages, 
  Trophy, 
  Newspaper, 
  UploadCloud, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import "./Features.scss";

const featureList = [
  {
    icon: <BookOpen size={32} color="#00f0ff" />,
    tag: "High-Performance Reader",
    title: "Continuous Vertical & Manga-Style Canvas Reader",
    description: "Designed specifically for modern digital comic reading. Features smooth continuous scrolling, double-tap zoom, chapter jumping, and smart asset preloading that eliminates buffering even on slow mobile networks.",
    details: [
      "Optimized for 60fps vertical webtoon scrolling on mobile & desktop",
      "Offline reading progress tracking saved directly to your profile",
      "Dynamic background matching to reduce eye strain during night reading",
      "Full compatibility with long-strip webcomics and traditional horizontal panels"
    ],
    ctaText: "Browse Live Comics",
    ctaLink: "/manga-release-calendar"
  },
  {
    icon: <Scissors size={32} color="#f47521" />,
    tag: "Creator Tool",
    title: "In-Browser Webtoon Slicer (100% Free & Private)",
    description: "Built for independent comic creators who draw continuous vertical strips. Easily split 10,000px+ vertical files into standardized webtoon panels (<1280px) in seconds without uploading your files to any external server.",
    details: [
      "Client-side canvas processing: your unpublished artwork never leaves your computer",
      "Custom slicing heights, automatic overlap margins, and ZIP bulk export",
      "Zero quality compression: crisp line art and text readability preserved",
      "Completely free forever with no file size limits or watermarks"
    ],
    ctaText: "Launch Webtoon Slicer",
    ctaLink: "/tools/webtoon-slicer"
  },
  {
    icon: <Calendar size={32} color="#10b981" />,
    tag: "Global Tracker",
    title: "Live Manga & Indie Release Calendar",
    description: "Track upcoming release dates, scanlation drops, and official simulpubs for Shonen Manga, Korean Manhwa, and Indian Indie Graphic Novels with real-time countdown timers.",
    details: [
      "Daily countdowns for One Piece, Jujutsu Kaisen, Chainsaw Man, and Boruto",
      "Verified publishing schedules for Indian comic creators and indie web series",
      "Filter by genre: Dark Fantasy, Action Shonen, Comedy, Sci-Fi, and Martial Arts",
      "Direct chapter reading links integrated immediately upon release"
    ],
    ctaText: "View Drop Calendar",
    ctaLink: "/manga-release-calendar"
  },
  {
    icon: <Languages size={32} color="#b84dff" />,
    tag: "Vernacular Access",
    title: "Multi-Lingual Translation & Regional Accessibility",
    description: "Comics belong to everyone. ZealPlane features instant vernacular translation across major Indian languages, breaking down English barriers and bringing indie comics to millions of regional readers.",
    details: [
      "One-tap translation for Hindi (हिंदी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी)",
      "Zero page reload required: real-time in-DOM script rendering",
      "Native support for Indian indie comics written in regional dialects",
      "Broadens creator reach across diverse linguistic demographics"
    ],
    ctaText: "Explore Translated Comics",
    ctaLink: "/"
  },
  {
    icon: <Trophy size={32} color="#eab308" />,
    tag: "Reader Community",
    title: "Gamified XP System & Community Forums",
    description: "Earn reader karma and XP badges as you explore chapters, participate in creator Q&As, and debate lore theories in the dedicated ZealPlane Tavern community.",
    details: [
      "Level up your reader profile from Novice to Lore Master by reading chapters",
      "Dedicated discussion threads for every published comic issue",
      "Interactive polls and community predictions for upcoming manga chapters",
      "Direct message interactions with verified comic artists and writers"
    ],
    ctaText: "Join Community Forum",
    ctaLink: "/forum"
  },
  {
    icon: <Newspaper size={32} color="#ec4899" />,
    tag: "Lore Newsroom",
    title: "Deep-Dive Editorial Analysis & Comic Culture",
    description: "An authentic, independent editorial publication covering manga lore, creator breakdowns, and Indian comic history. 120+ published deep-dives written by passionate comic scholars.",
    details: [
      "In-depth analysis of manga climaxes, plot theories, and author interviews",
      "Historical preservation of Indian comic franchises (Raj Comics, Tulsi, Diamond)",
      "Industry reporting on indie publishing trends, Kickstarter graphic novels, and events",
      "Zero clickbait: substantive 900+ word analytical journalism"
    ],
    ctaText: "Read Latest News",
    ctaLink: "/news"
  }
];

const Features = () => {
  return (
    <div className="features-page-root">
      <Helmet>
        <title>Features &amp; Creator Tools — ZealPlane Indie Comic Platform</title>
        <meta 
          name="description" 
          content="Explore ZealPlane's complete suite of digital comic reading and creator tools: High-speed vertical reader, free Webtoon Slicer, live Manga Release Calendar, vernacular translation, and community forums." 
        />
        <link rel="canonical" href="https://www.zealplane.com/features" />
      </Helmet>

      <Navbar />

      <main className="features-main-content">
        {/* ── HERO ── */}
        <header className="features-hero">
          <div className="features-container">
            <div className="features-badge">
              <Sparkles size={14} style={{ color: "#f47521" }} />
              <span>Engineered For Comics</span>
            </div>
            <h1 className="features-title">The Complete Platform for Indie Comics &amp; Webtoons</h1>
            <p className="features-subtitle">
              From our privacy-first in-browser Webtoon Slicer to our lightning-fast continuous reader and
              live release calendar — ZealPlane equips creators with distribution and readers with zero-paywall immersion.
            </p>
            <div className="features-hero-actions">
              <Link to="/tools/webtoon-slicer" className="features-btn-primary">
                <span>Try Webtoon Slicer Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" className="features-btn-secondary">
                <span>View Free Pricing Model</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ── FEATURES GRID ── */}
        <section className="features-grid-section" aria-label="ZealPlane Feature Breakdown">
          <div className="features-container">
            <div className="features-grid">
              {featureList.map((f, i) => (
                <article key={i} className="feature-card">
                  <div className="feature-icon-wrapper">
                    {f.icon}
                  </div>
                  <div className="feature-tag">{f.tag}</div>
                  <h2 className="feature-heading">{f.title}</h2>
                  <p className="feature-text">{f.description}</p>
                  
                  <ul className="feature-bullet-list">
                    {f.details.map((d, dIdx) => (
                      <li key={dIdx}>
                        <CheckCircle2 size={16} className="feature-check" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={f.ctaLink} className="feature-link">
                    <span>{f.ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CREATOR WORKFLOW SECTION ── */}
        <section className="creator-workflow-section">
          <div className="features-container">
            <div className="workflow-card">
              <div className="workflow-text">
                <span className="workflow-tag">How It Works</span>
                <h2>Self-Publishing in 3 Simple Steps</h2>
                <div className="workflow-steps">
                  <div className="step-item">
                    <span className="step-num">01</span>
                    <div className="step-body">
                      <h4>Slice &amp; Format</h4>
                      <p>Use our client-side Webtoon Slicer to format your tall vertical canvas into standard, fast-loading mobile panels in seconds.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-num">02</span>
                    <div className="step-body">
                      <h4>Upload &amp; Tag</h4>
                      <p>Set your series title, synopsis, genre tags, and cover art. Our system handles responsive image delivery and CDN hosting at zero cost to you.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <span className="step-num">03</span>
                    <div className="step-body">
                      <h4>Reach Readers &amp; Earn</h4>
                      <p>Your comic goes live instantly to thousands of readers with optional ₹1 micro-supporter tipping enabled directly to your wallet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="features-cta-strip">
          <div className="features-container">
            <h2>Ready to share your story or dive into original indie comics?</h2>
            <p>Join thousands of comic creators and webtoon fans on ZealPlane today. 100% free forever.</p>
            <div className="cta-buttons">
              <Link to="/register" className="features-btn-primary">
                <span>Create Free Account</span>
              </Link>
              <Link to="/" className="features-btn-secondary">
                <span>Read Comics Now</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
