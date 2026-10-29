import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Sparkles, 
  Palette, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Flame, 
  ShieldCheck,
  Scissors,
  Calendar,
  Languages,
  Zap
} from "lucide-react";
import "./LandingUseCasesAndFaq.scss";

const useCases = [
  {
    badge: "For Readers",
    badgeColor: "#00f0ff",
    title: "Binge Original Comics Without Subscriptions or Paywalls",
    description: "Read gripping Indian webcomics, dark fantasy manga, and action graphic novels from independent storytellers. Every chapter is free to read on any mobile or desktop browser.",
    features: [
      "Zero Paywalls: Read full series without coin gates or locked chapters",
      "Vernacular Translation: Read comfortably in Hindi, English, Bengali, Tamil, Telugu, and Marathi",
      "Release Tracker: Never miss weekly chapter updates with live countdowns",
      "Community Discussions: Debate theories and share reactions with thousands of readers"
    ],
    ctaText: "Start Reading Free",
    ctaLink: "/manga-release-calendar",
    highlight: "Popular: Sando Ki Duniya, Aghori, Chullu aur Lootera Bhoot, Karate King"
  },
  {
    badge: "For Creators & Artists",
    badgeColor: "#ff7700",
    title: "Publish Your Stories Directly to 10,000+ Readers Tonight",
    description: "Stop pitching to traditional gatekeepers. Upload your high-resolution comic pages, format them with our built-in Webtoon Slicer, and build a dedicated reader following from day one.",
    features: [
      "100% IP Ownership: You retain full copyright, publishing, and film adaptation rights",
      "Free In-Browser Webtoon Slicer: Slice tall vertical canvases into standard webtoon panels in seconds",
      "Zero Algorithm Gatekeeping: Every approved indie comic gets prime homepage and explore visibility",
      "Direct Reader Support: Enable ₹1 micro-tipping to let passionate fans support your craft directly"
    ],
    ctaText: "Open Creator Studio",
    ctaLink: "/tools/webtoon-slicer",
    highlight: "100% free hosting • 0 platform listing fees • Fast automated publishing"
  },
  {
    badge: "For Lore & Pop-Culture Fans",
    badgeColor: "#b84dff",
    title: "Deep-Dive Editorial Analysis & Chapter Breakdowns",
    description: "Explore comprehensive, lore-heavy analysis of Shonen epics (One Piece, Jujutsu Kaisen, Chainsaw Man) and golden-era Indian comics (Raj Comics, Nagraj, Doga, Dhruva).",
    features: [
      "Daily Lore Newsroom: Rigorous analysis of chapter climaxes, character motivations, and leaks",
      "Historical Retrospectives: Retrospective deep-dives into Indian comic publishing heritage",
      "Creator Interviews: Insights into indie storytelling, panel composition, and self-publishing",
      "Interactive Chapter Breakdowns: Visual chapter recaps breaking down hidden foreshadowing"
    ],
    ctaText: "Explore Newsroom",
    ctaLink: "/news",
    highlight: "120+ published editorial breakdowns • 95%+ Google indexed coverage"
  }
];

const faqs = [
  {
    q: "Is ZealPlane completely free to read and publish comics?",
    a: "Yes. 100% of comics, graphic novels, release calendars, and lore articles on ZealPlane are free to access without subscription paywalls, digital coins, or forced registration. Creators can publish their work completely free with zero listing fees and zero bandwidth charges."
  },
  {
    q: "Do comic creators retain the copyright and ownership of their artwork?",
    a: "Yes, absolutely. You retain 100% full intellectual property (IP) and copyright ownership over your comics, storylines, and character designs. ZealPlane acts solely as a non-exclusive digital distribution and discovery platform. You are free to publish elsewhere, sell physical copies, or license film/animation adaptations at any time."
  },
  {
    q: "What is the built-in Webtoon Slicer tool?",
    a: "The ZealPlane Webtoon Slicer is an in-browser creator utility located at /tools/webtoon-slicer. It takes tall, continuous vertical webtoon canvases (e.g. 800x12000px) and automatically slices them into standard, optimized panels (under 1280px tall) with zero server uploads and zero quality loss. It is completely free to use."
  },
  {
    q: "How does the ₹1 Micro-Supporter feature work for creators?",
    a: "ZealPlane offers an optional creator patronage tier where readers who love a comic can tip creators as little as ₹1. Over 90% of the funds go directly to the verified creator via secure payment gateways, giving independent artists sustainable micro-monetization without alienating free readers."
  },
  {
    q: "How does the multi-lingual vernacular reading engine work?",
    a: "ZealPlane integrates an automated, non-intrusive vernacular translation bar that translates comic text, UI elements, and lore articles into Hindi (हिंदी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Gujarati, and Kannada with a single tap."
  },
  {
    q: "How do I get my comic featured on the ZealPlane homepage?",
    a: "All newly published comics with clear, readable panels and original artwork are automatically featured in our 'Fresh Drops' and 'Release Calendar' feeds. High-engagement comics with strong reader retention are highlighted on the trending homepage marquee."
  }
];

const LandingUseCasesAndFaq = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section className="luc-faq-section" aria-label="Use Cases and Frequently Asked Questions">
      <div className="luc-container">
        
        {/* ── SECTION HEADER ── */}
        <div className="luc-header">
          <div className="luc-pill">
            <Sparkles size={14} style={{ color: "#f47521" }} />
            <span>Built For Real Creators &amp; Readers</span>
          </div>
          <h2 className="luc-title">How ZealPlane Solves the Indie Comic Problem</h2>
          <p className="luc-subtitle">
            Traditional publishing is slow and algorithm-gated. ZealPlane provides instant digital distribution,
            transparent monetization, and zero-barrier reading for fans worldwide.
          </p>
        </div>

        {/* ── 3 CONCRETE USE CASES ── */}
        <div className="luc-grid">
          {useCases.map((uc, idx) => (
            <div key={idx} className="luc-card">
              <div className="luc-card-badge" style={{ borderColor: uc.badgeColor, color: uc.badgeColor }}>
                {uc.badge}
              </div>
              <h3 className="luc-card-title">{uc.title}</h3>
              <p className="luc-card-desc">{uc.description}</p>
              
              <ul className="luc-features-list">
                {uc.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <CheckCircle2 size={16} className="luc-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="luc-card-footer">
                <Link to={uc.ctaLink} className="luc-cta-btn">
                  <span>{uc.ctaText}</span>
                  <Zap size={14} />
                </Link>
                <div className="luc-highlight">{uc.highlight}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PROOF METRICS BAR ── */}
        <div className="luc-proof-bar">
          <div className="luc-proof-item">
            <span className="luc-proof-val">100%</span>
            <span className="luc-proof-lbl">Free Access for Readers</span>
          </div>
          <div className="luc-proof-sep" />
          <div className="luc-proof-item">
            <span className="luc-proof-val">250+</span>
            <span className="luc-proof-lbl">Published Chapters &amp; Articles</span>
          </div>
          <div className="luc-proof-sep" />
          <div className="luc-proof-item">
            <span className="luc-proof-val">100%</span>
            <span className="luc-proof-lbl">Creator IP &amp; Rights Retention</span>
          </div>
          <div className="luc-proof-sep" />
          <div className="luc-proof-item">
            <span className="luc-proof-val">0</span>
            <span className="luc-proof-lbl">Listing Fees or Subscriptions</span>
          </div>
        </div>

        {/* ── FAQ ACCORDION ── */}
        <div className="luc-faq-wrapper" id="faq">
          <div className="luc-faq-header">
            <div className="luc-pill">
              <HelpCircle size={14} style={{ color: "#00f0ff" }} />
              <span>Got Questions?</span>
            </div>
            <h3 className="luc-faq-title">Frequently Asked Questions</h3>
            <p className="luc-faq-sub">
              Everything you need to know about reading, publishing, and monetizing your work on ZealPlane.
            </p>
          </div>

          <div className="luc-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`luc-faq-item ${isOpen ? "active" : ""}`}
                  onClick={() => toggleFaq(index)}
                >
                  <button 
                    className="luc-faq-trigger" 
                    type="button" 
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`luc-faq-chevron ${isOpen ? "rotated" : ""}`} size={18} />
                  </button>
                  {isOpen && (
                    <div className="luc-faq-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="luc-faq-more">
            <p>Have a custom question or publishing collaboration inquiry?</p>
            <Link to="/about" className="luc-faq-contact-link">Contact ZealPlane Editorial Team &rarr;</Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingUseCasesAndFaq;
