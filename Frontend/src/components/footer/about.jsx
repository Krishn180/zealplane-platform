import React, { useEffect } from "react";
import "./About.scss";
import { FaSuperpowers, FaPenNib, FaUsers } from "react-icons/fa";
import background from "./../../assets/back.jpeg";
import Arti from "./../../assets/arat.jpeg";
import krishna from "./../../assets/krishna.jpg";
import Jayshree from "./../../assets/Jaishree.jpeg";
import Prince from "./../../assets/Prince.jpg";
import Navbar from "../../AboutCard/Navbar";
import Footer from "./Footer";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  useEffect(() => {
    // Dynamic page title for SEO
    document.title = "About Us — ZealPlane Studio & Indie Comic Platform";

    // Dynamic description meta tag for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute("content");
    metaDesc.setAttribute(
      "content",
      "Discover ZealPlane - a vibrant community connecting comic enthusiasts, geeks, and creators. Meet our engineering and creative team, read our story, and explore our mission."
    );

    // Dynamic AboutPage & Person Schema.org JSON-LD for E-E-A-T
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "AboutPage",
          "@id": "https://www.zealplane.com/about#webpage",
          "url": "https://www.zealplane.com/about",
          "name": "About ZealPlane | Leadership, Editorial Standards & Multiverse Mission",
          "description": "Meet the team and creators behind ZealPlane, India's premier digital indie comic and manga community platform.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://www.zealplane.com/#website",
            "name": "ZealPlane",
            "url": "https://www.zealplane.com"
          },
          "about": {
            "@id": "https://www.zealplane.com/#organization"
          }
        },
        {
          "@type": "Person",
          "@id": "https://www.zealplane.com/about#krishna-kumar",
          "name": "Krishna Kumar",
          "jobTitle": "Founder & Lead Engineer | Author & Comic Creator",
          "worksFor": {
            "@id": "https://www.zealplane.com/#organization"
          },
          "description": "Founder and Lead Engineer at ZealPlane, author of G.O.D (Game of Death) on Amazon, creator of Boomba (FictionSaga), and writer of the dark fantasy comic Karma.",
          "sameAs": [
            "https://www.amazon.in/dp/B0D7367ZHM",
            "https://fictionsaga.com/product/boomba/",
            "https://medium.com/@krishnakumar050.kk",
            "https://medium.com/@krishnakumar050.kk/i-lost-my-love-my-team-and-my-code-i-built-it-again-anyway-c99336af83f6",
            "https://www.linkedin.com/company/zealplane",
            "https://x.com/plane38843"
          ],
          "knowsAbout": [
            "Software Architecture",
            "Comic Book Publishing",
            "Supernatural Fiction",
            "Manga Analysis",
            "Indie Graphic Novels"
          ]
        },
        {
          "@type": "Person",
          "@id": "https://www.zealplane.com/about#prince",
          "name": "Prince",
          "jobTitle": "Content Delivery Manager | Animator & Visual Designer",
          "worksFor": {
            "@id": "https://www.zealplane.com/#organization"
          },
          "description": "Content Delivery Manager at ZealPlane specializing in 2D/3D animation, comic trailers, motion graphics, video editing, and brand identity design.",
          "knowsAbout": [
            "2D Animation",
            "3D Animation",
            "Video Editing",
            "Motion Graphics",
            "Logo & Brand Identity"
          ]
        }
      ]
    };

    let scriptTag = document.getElementById("zp-about-schema");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "zp-about-schema";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      document.title = prevTitle;
      if (metaDesc) {
        metaDesc.setAttribute("content", prevDesc || "ZealPlane (ZealPlane) - The ultimate multiverse tavern for comic book enthusiasts.");
      }
      const existingScript = document.getElementById("zp-about-schema");
      if (existingScript) existingScript.remove();
    };
  }, []);

  const team = [
    {
      name: "Krishna Kumar",
      role: "Founder & Lead Engineer | Author & Comic Creator",
      bio: "Krishna Kumar is the Founder & Lead Engineer of ZealPlane, an author, and an indie comic creator. He authored the supernatural Hindi thriller novel G.O.D (Game of Death) available on Amazon, created the published comic Boomba with Fiction Comics (FictionSaga), and writes the dark fantasy saga Karma. He leads ZealPlane's platform architecture and oversees editorial analysis for manga and Indian indie graphic fiction.",
      image: krishna,
      specialties: ["Platform Architecture", "Supernatural Thrillers", "Indie Comic Publishing", "Shonen Manga Analysis"],
      verifiedWorks: [
        {
          label: "G.O.D (Game of Death)",
          badge: "Amazon Novel",
          url: "https://www.amazon.in/dp/B0D7367ZHM?tag=zealplane-21",
          external: true
        },
        {
          label: "Boomba (Comic Book)",
          badge: "FictionSaga",
          url: "https://fictionsaga.com/product/boomba/",
          external: true
        },
        {
          label: "Karma (Dark Fantasy)",
          badge: "ZealPlane Saga",
          url: "/details/6a60d6370cb3db69eafea318-karma",
          external: false
        },
        {
          label: "Building ZealPlane Story",
          badge: "Medium",
          url: "https://medium.com/@krishnakumar050.kk/i-lost-my-love-my-team-and-my-code-i-built-it-again-anyway-c99336af83f6",
          external: true
        }
      ],
      hidden: false
    },
    {
      name: "Arati Prasad",
      role: "Founder & COO",
      bio: "Arati Prasad is a full-stack developer and a banker. She excels in modern web technologies and financial management. Her diverse expertise allows her to thrive in both fields.",
      image: Arti,
      hidden: true // Hidden from team section, easily recoverable
    },
    {
      name: "Jayshree",
      role: "Social Media Marketing Manager",
      bio: "Jayshree is the voice of ZealPlane on social media. She manages our online presence, builds engaging campaigns, and connects with fans across platforms to grow our vibrant community.",
      image: Jayshree,
      hidden: true // Hidden from team section, easily recoverable
    },
    {
      name: "Prince",
      role: "Content Delivery Manager | Animator & Visual Designer",
      bio: "Prince leads multimedia content delivery, 2D/3D animation, comic trailers, video editing, and visual brand identity for ZealPlane. An experienced visual designer and animator, he ensures all digital media and indie creator adaptations are presented at the highest visual standard.",
      image: Prince,
      specialties: ["2D/3D Animation", "Video Editing & Trailers", "Motion Graphics", "Logo & Brand Design"],
      verifiedWorks: [],
      hidden: false
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 7000,
    responsive: [
      {
        breakpoint: 1024, // tablets & below
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Navbar id="about-navbar" />
      
      <main className="about-page" id="about-main-content">
        <section className="about-editorial-hero" style={{
          background: "linear-gradient(180deg, rgba(20, 24, 38, 0.95) 0%, rgba(8, 8, 12, 1) 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "50px 20px 35px",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <span style={{ 
              display: "inline-block", 
              background: "rgba(244, 117, 33, 0.15)", 
              color: "#f47521", 
              padding: "6px 16px", 
              borderRadius: "20px", 
              fontSize: "12px", 
              fontWeight: "700", 
              letterSpacing: "1.5px", 
              textTransform: "uppercase", 
              marginBottom: "16px",
              border: "1px solid rgba(244, 117, 33, 0.3)"
            }}>
              ZealPlane Masthead &amp; Editorial Mission
            </span>
            <h1 style={{ 
              fontSize: "34px", 
              fontWeight: "800", 
              color: "#ffffff", 
              lineHeight: "1.3", 
              marginBottom: "14px",
              fontFamily: "'Inter', sans-serif"
            }}>
              About ZealPlane: The Independent Comic &amp; Manga Platform
            </h1>
            <p style={{ 
              fontSize: "16px", 
              color: "#94a3b8", 
              lineHeight: "1.65", 
              maxWidth: "760px", 
              margin: "0 auto" 
            }}>
              Dedicated to creator-first visual storytelling, 100% intellectual property ownership, manga scholarship, and empowering independent comic authors across India and the global indie community.
            </p>
          </div>
        </section>

        <section className="about-section" id="about-intro-section" style={{ maxWidth: "900px", margin: "30px auto", padding: "0 20px" }}>
          <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "700", marginBottom: "14px", borderLeft: "4px solid #f47521", paddingLeft: "12px" }}>
            Our Mission &amp; Independent Ethos
          </h2>
          <p style={{ textAlign: "start", color: "#cbd5e1", fontSize: "15px", lineHeight: "1.75" }}>
            Founded in May 2023, ZealPlane was established to address fundamental distribution bottlenecks in the comic and visual storytelling industry. For decades, independent comic artists, manga creators, and webtoonists across India and emerging creative hubs faced insurmountable barriers: high upfront printing costs, predatory exclusivity contracts, and a complete absence of creator-first monetization.
          </p>
          <p style={{ textAlign: "start", color: "#cbd5e1", fontSize: "15px", lineHeight: "1.75", marginTop: "12px" }}>
            ZealPlane solves this by guaranteeing <strong>100% intellectual property (IP) retention</strong> to all published creators, direct reader patronage via our frictionless micro-supporter engine, and zero-fee hosting infrastructure. Readers enjoy unrestricted access to high-standard graphic fiction spanning dark supernatural thrillers, slice-of-life drama, superhero action, and rich Indian mythology.
          </p>
        </section>

        <section className="features-section" id="about-features-section" style={{ maxWidth: "960px", margin: "20px auto", padding: "0 20px" }}>
          <h2 style={{ color: "#ff5f57", textAlign: "center", marginBottom: "25px" }}>Core Platform Pillars</h2>
          <div className="feature-cards">
            <div className="feature-card" id="about-feat-creators">
              <FaSuperpowers className="feature-icon" />
              <h3>Creator Autonomy</h3>
              <p>
                Visual artists retain complete copyright, merchandising rights, and narrative freedom over their serialized works.
              </p>
            </div>
            <div className="feature-card" id="about-feat-stories">
              <FaPenNib className="feature-icon" />
              <h3>Original Graphic Literature</h3>
              <p>
                A curated library of indie manga, Indian graphic novels, and digital webtoons with full multilingual reading support.
              </p>
            </div>
            <div className="feature-card" id="about-feat-community">
              <FaUsers className="feature-icon" />
              <h3>Editorial Integrity</h3>
              <p>
                In-depth cultural essays, narrative forensics, chapter breakdowns, and creator interviews built on human research.
              </p>
            </div>
          </div>
        </section>

        <section className="story-section" id="about-editorial-standards" style={{ maxWidth: "900px", margin: "30px auto", padding: "24px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: "700", marginBottom: "12px", borderLeft: "4px solid #38bdf8", paddingLeft: "12px" }}>
            Editorial Standards &amp; Verification Policy
          </h2>
          <p style={{ color: "#cbd5e1", fontSize: "14.5px", lineHeight: "1.7", marginBottom: "12px" }}>
            ZealPlane Chronicles operates under strict journalistic standards. Every article published on our platform undergoes rigorous editorial fact-checking:
          </p>
          <ul style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", paddingLeft: "20px", marginBottom: "14px" }}>
            <li><strong>Primary Source Verification:</strong> All reporting is anchored in verifiable statements from mangaka, authorized animation studios (MAPPA, Toei, Wit, Ufotable), official Jump/Kodansha press briefings, and certified copyright registries.</li>
            <li><strong>Original Narrative Forensics:</strong> We reject speculative clickbait, recycled press releases, and automated scraper summaries. Our articles provide first-hand thematic analysis, panel composition studies, and cultural context.</li>
            <li><strong>Corrections Policy:</strong> If a fact, date, or attribution error occurs, our editorial team promptly issues an update notice at the head of the article. Inquiries may be directed to <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8" }}>teamzealplane@gmail.com</a>.</li>
          </ul>
        </section>

        <h2 className="team-heading" id="about-team-heading">Editorial Masthead &amp; Platform Leadership</h2>
        
        <section className="team-section" id="about-team-carousel-section">
          <Slider {...sliderSettings} id="about-team-slider">
            {team.filter((member) => !member.hidden).map((member, i) => (
              <div key={i} className="team-member" id={`team-member-card-${i}`}>
                <div className="member-image">
                  <img src={member.image} alt={member.name} id={`team-member-avatar-${i}`} />
                </div>
                <div className="member-info">
                  <h3 id={`team-member-name-${i}`}>{member.name}</h3>
                  <p className="role">
                    <strong>{member.role}</strong>
                  </p>
                  <p className="bio-text">{member.bio}</p>

                  {member.specialties && (
                    <div className="member-specialties" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", margin: "14px 0 8px" }}>
                      {member.specialties.map((spec, sIdx) => (
                        <span key={sIdx} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "12px", background: "rgba(255, 95, 87, 0.12)", color: "#ff8e88", fontWeight: "600" }}>
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {member.verifiedWorks && member.verifiedWorks.length > 0 && (
                    <div className="member-verified-works" style={{ marginTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "12px" }}>
                      <span style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "1px", color: "#38bdf8", fontWeight: "700", display: "block", marginBottom: "8px" }}>
                        Verified Publications &amp; Works
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
                        {member.verifiedWorks.map((work, wIdx) => (
                          <a
                            key={wIdx}
                            href={work.url}
                            target={work.external ? "_blank" : "_self"}
                            rel={work.external ? "noopener noreferrer" : ""}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              background: "rgba(56, 189, 248, 0.1)",
                              border: "1px solid rgba(56, 189, 248, 0.25)",
                              color: "#f8fafc",
                              fontSize: "12px",
                              textDecoration: "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span>{work.label}</span>
                            <span style={{ fontSize: "9.5px", background: "#38bdf8", color: "#0f172a", padding: "1px 5px", borderRadius: "4px", fontWeight: "700" }}>
                              {work.badge}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <section className="cta-section" id="about-cta-section">
          <h2>Join the ZealPlane Community</h2>
          <p>
            Whether you're a fan, creator, or artist, ZealPlane is the place
            for you. Join us today, connect with other like-minded individuals,
            and discover a world of exciting comics and creative expression!
          </p>
        </section>
      </main>

      <Footer id="about-footer" />
    </>
  );
};

export default About;
