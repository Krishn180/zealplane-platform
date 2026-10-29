import React from "react";
import { Link } from "react-router-dom";

const EditorialHubSeoProse = () => {
  return (
    <section 
      className="zealplane-seo-editorial-hub" 
      style={{
        maxWidth: "1200px",
        margin: "48px auto 32px auto",
        padding: "36px 30px",
        background: "rgba(15, 23, 42, 0.75)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        borderRadius: "16px",
        color: "#cbd5e1",
        backdropFilter: "blur(10px)"
      }}
    >
      <h2 style={{
        color: "#f8fafc",
        fontSize: "22px",
        fontWeight: 700,
        marginTop: 0,
        marginBottom: "16px",
        borderBottom: "2px solid #3b82f6",
        display: "inline-block",
        paddingBottom: "6px"
      }}>
        About ZealPlane: The Independent Comic Publishing & Manga Editorial Hub
      </h2>

      <p style={{ fontSize: "14.5px", lineHeight: 1.8, marginBottom: "16px", color: "#94a3b8" }}>
        ZealPlane is an open digital storytelling platform and creator-first publishing hub dedicated to democratizing independent comics, graphic novels, manga, and manhwa. Founded with the mission to empower visual authors across India and the global indie circuit, ZealPlane provides artists with 100% intellectual property (IP) retention, direct reader patronage via a ₹1 micro-supporter engine, and zero-fee hosting infrastructure. Unlike legacy publishers that lock creators into restrictive contracts, ZealPlane champions author autonomy while offering readers an expansive library of original serialized works spanning dark fantasy, slice-of-life, superhero action, and psychological drama. Learn more about our founding team, editorial philosophy, and submission guidelines on our <Link to="/about" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>About Us page</Link>, or connect with our creative team directly via our <Link to="/contact-us" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Contact Hub</Link>.
      </p>

      <p style={{ fontSize: "14.5px", lineHeight: 1.8, marginBottom: "16px", color: "#94a3b8" }}>
        To support comic creators throughout their production pipeline, ZealPlane develops free specialized web utilities like the in-browser <Link to="/tools/webtoon-slicer" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>ZealPlane Webtoon Slicer</Link>. This high-performance client-side tool allows digital illustrators to split continuous vertical webtoon canvases into optimized, mobile-responsive vertical strips without quality degradation or file compression artifacts. Furthermore, our reader engine features automated vernacular translation support, making graphic literature accessible in Hindi (हिंदी), Bengali, Tamil, Telugu, and English. Readers can explore original studio-developed titles such as <Link to="/details/6a60d6370cb3db69eafea317-karma" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Karma</Link>, an original series that combines intense narrative pacing with dynamic digital panel layouts.
      </p>

      <p style={{ fontSize: "14.5px", lineHeight: 1.8, marginBottom: "16px", color: "#94a3b8" }}>
        Beyond digital hosting, ZealPlane operates a dedicated comic editorial desk conducting forensic craftsmanship breakdowns, panel pacing analyses, and cultural retrospectives. Our research explores structural visual geometry in the <Link to="/news/oda-spread-geometry-one-piece-double-page-visual-weight" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Oda Spread Geometry masterclass</Link>, investigates the historical foundations of indigenous Indian superhero culture in <Link to="/news/the-untold-story-of-raj-comics-how-nagraj-and-doga-built-indias-comic-empire" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>The Untold Story of Raj Comics</Link>, examines the modern graphic novel movement in our <Link to="/news/swapnil-comics-indian-indie-graphic-novel-renaissance-deep-dive" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Swapnil Comics and Indian Indie Renaissance investigation</Link>, documents open-source community localization in <Link to="/news/pepper-and-carrot-why-this-open-source-webcomic-has-over-50-translations" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Pepper and Carrot's Open-Source Model</Link>, and examines cinematic manga transitions in our <Link to="/news/chainsaw-man-reze-arc-movie-vs-manga-craft-differences" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Chainsaw Man Reze Arc Craft Comparison</Link>.
      </p>

      <p style={{ fontSize: "14.5px", lineHeight: 1.8, marginBottom: 0, color: "#94a3b8" }}>
        ZealPlane maintains strict compliance with digital copyright protections, transparent editorial ethics, and international user privacy standards. For details on user data handling, cookie choices, and terms of service, please visit our <Link to="/privacy-policy" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Privacy Policy</Link> and <Link to="/terms-of-use" style={{ color: "#60a5fa", fontWeight: 600, textDecoration: "underline" }}>Terms of Use</Link>. Whether you are an aspiring illustrator preparing your debut chapter or a reader seeking immersive visual worlds, ZealPlane provides the platform and community to elevate independent sequential art.
      </p>
    </section>
  );
};

export default EditorialHubSeoProse;
