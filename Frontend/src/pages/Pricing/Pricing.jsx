import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../../AboutCard/Navbar";
import Footer from "../../components/footer/Footer";
import { 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Heart, 
  Coins, 
  HelpCircle,
  ArrowRight
} from "lucide-react";
import "./Pricing.scss";

const pricingTiers = [
  {
    name: "Reader Pass",
    price: "₹0",
    period: "Free Forever",
    badge: "100% Free",
    description: "Unrestricted digital comic and manga reading for fans in India and worldwide. No coins, no tokens, no locked paywalls.",
    features: [
      "Read all original indie comics and graphic novels free",
      "Live Manga & Webcomic Release Calendar with drop countdowns",
      "Instant vernacular translation (Hindi, Bengali, Tamil, Telugu, Marathi)",
      "Reader progress synchronization & offline chapter bookmarks",
      "Participate in chapter discussion forums, polls, and community Q&As",
      "Zero registration paywalls or forced credit card prompts"
    ],
    ctaText: "Start Reading Now",
    ctaLink: "/",
    isPopular: false
  },
  {
    name: "Creator Studio",
    price: "₹0",
    period: "Zero Platform Fees",
    badge: "For Artists & Writers",
    description: "Complete self-publishing suite for indie comic creators, webtoon artists, and novel writers to reach thousands of readers.",
    features: [
      "100% Intellectual Property & Copyright ownership retained by you",
      "Unlimited comic series and chapter uploads with zero hosting fees",
      "Free access to client-side in-browser Webtoon Slicer tool",
      "Real-time reader view counters and chapter retention analytics",
      "Automated inclusion in 'Trending Comics' and 'Release Calendar'",
      "Direct reader feedback, rating metrics, and comment engagement"
    ],
    ctaText: "Open Creator Studio",
    ctaLink: "/tools/webtoon-slicer",
    isPopular: true
  },
  {
    name: "Creator Patronage",
    price: "₹1+",
    period: "Micro-Tipping",
    badge: "Direct Support",
    description: "An optional reader-to-artist tipping model designed to keep comics free for the public while giving artists sustainable micro-income.",
    features: [
      "Voluntary reader tipping starting at just ₹1 per chapter",
      "90%+ direct artist payout transferred via secure payment gateways",
      "Zero subscription lock-in for readers: tip only when you love a story",
      "Supporter badge shown next to reader comments on creator series",
      "Automated monthly earnings reports sent to verified creator dashboards",
      "Compliant with Indian banking standards, UPI, and RBI guidelines"
    ],
    ctaText: "Learn About Tipping",
    ctaLink: "/about",
    isPopular: false
  }
];

const pricingFaqs = [
  {
    q: "Why is ZealPlane free for readers?",
    a: "We believe great comic stories shouldn't be locked behind aggressive coin paywalls or restrictive micro-transactions. ZealPlane is funded through non-intrusive banner advertising (such as Google AdSense) and voluntary creator micro-tipping, ensuring that readers enjoy unrestricted access while keeping the platform accessible to all."
  },
  {
    q: "Does ZealPlane charge creators to host or publish comics?",
    a: "No. Publishing on ZealPlane is 100% free with zero platform listing fees, zero storage charges, and zero bandwidth limits. You can upload entire multi-chapter series without ever paying a rupee."
  },
  {
    q: "Do I give up any copyright or film rights when publishing on ZealPlane?",
    a: "Never. You retain 100% exclusive intellectual property (IP), character rights, and publishing rights. ZealPlane holds only a non-exclusive digital distribution license while your comic remains published on our platform. You can remove your comic, publish on other platforms (Webtoon, Tapas), or license film/TV adaptations at any time."
  },
  {
    q: "How does the ₹1 creator micro-support tier work?",
    a: "Readers who wish to support their favorite creators can send micro-tips starting at ₹1 using UPI, debit/credit cards, or net banking via our secure gateway (Razorpay). Over 90% of the tip goes directly to the creator's payout balance."
  },
  {
    q: "Are there any hidden subscription renewals or surprise fees?",
    a: "None whatsoever. There are no recurring auto-debit subscriptions, hidden renewal fees, or surprise bills. If you choose to tip a creator ₹1 or ₹50, that is a one-time transaction authorized directly by you."
  }
];

const Pricing = () => {
  return (
    <div className="pricing-page-root">
      <Helmet>
        <title>Pricing &amp; Monetization Policy — ZealPlane Digital Comics</title>
        <meta 
          name="description" 
          content="ZealPlane is 100% free forever for comic readers and creators. Zero subscription paywalls, zero publishing listing fees, and 100% creator IP ownership with voluntary ₹1 micro-tipping." 
        />
        <link rel="canonical" href="https://www.zealplane.com/pricing" />
      </Helmet>

      <Navbar />

      <main className="pricing-main-content">
        {/* ── HERO ── */}
        <header className="pricing-hero">
          <div className="pricing-container">
            <div className="pricing-badge">
              <Sparkles size={14} style={{ color: "#f47521" }} />
              <span>Transparent &amp; Free Forever</span>
            </div>
            <h1 className="pricing-title">Zero Paywalls. 100% Free Reading &amp; Creator Publishing.</h1>
            <p className="pricing-subtitle">
              We reject predatory coin systems and high platform fees. Readers enjoy all comics free of charge,
              and creators publish their stories with zero listing charges and full copyright retention.
            </p>
          </div>
        </header>

        {/* ── TIERS ── */}
        <section className="pricing-cards-section" aria-label="ZealPlane Pricing Plans">
          <div className="pricing-container">
            <div className="pricing-grid">
              {pricingTiers.map((tier, idx) => (
                <div key={idx} className={`pricing-card ${tier.isPopular ? "popular" : ""}`}>
                  {tier.isPopular && <div className="popular-pill">Most Popular</div>}
                  <div className="tier-badge">{tier.badge}</div>
                  <h2 className="tier-name">{tier.name}</h2>
                  <div className="tier-price-box">
                    <span className="price-val">{tier.price}</span>
                    <span className="price-period">{tier.period}</span>
                  </div>
                  <p className="tier-desc">{tier.description}</p>
                  
                  <ul className="tier-feature-list">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <CheckCircle2 size={16} className="tier-check" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={tier.ctaLink} className={`tier-btn ${tier.isPopular ? "btn-highlight" : "btn-normal"}`}>
                    <span>{tier.ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MONETIZATION INTEGRITY STATEMENT ── */}
        <section className="monetization-statement-section">
          <div className="pricing-container">
            <div className="statement-box">
              <div className="statement-icon">
                <ShieldCheck size={36} color="#10b981" />
              </div>
              <div className="statement-content">
                <h3>Our Sustainable Monetization Philosophy</h3>
                <p>
                  ZealPlane relies on digital advertising partnerships (such as Google AdSense) and direct voluntary creator tipping
                  rather than aggressive subscription paywalls. This ensures that independent comics gain the widest possible readership
                  across India and worldwide, while advertising revenue supports our high-speed server infrastructure, CDN bandwidth,
                  and free creator tooling.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQS ── */}
        <section className="pricing-faq-section" aria-label="Pricing and Payment FAQs">
          <div className="pricing-container">
            <div className="pricing-faq-header">
              <span className="faq-tag">Got Questions?</span>
              <h2>Frequently Asked Questions About Pricing</h2>
            </div>

            <div className="pricing-faq-grid">
              {pricingFaqs.map((faq, i) => (
                <article key={i} className="faq-item-card">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
