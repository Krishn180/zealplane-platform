import React, { useEffect } from "react";
import Header from "../header/Header";
import Footer from "./Footer";
import { FaEnvelope, FaHeadset, FaFileContract, FaBuilding } from "react-icons/fa";
import "./About.scss";

const ContactUs = () => {
  useEffect(() => {
    document.title = "Contact Us | ZealPlane Creator Support & Editorial Desk";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      "content",
      "Contact ZealPlane for creator comic publishing support, editorial inquiries, partnerships, or DMCA compliance notices. We respond within 24-48 business hours."
    );
  }, []);

  return (
    <>
      <Header />
      <main style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", color: "#f8fafc", minHeight: "70vh" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", marginBottom: "12px", borderBottom: "2px solid rgba(255, 255, 255, 0.1)", paddingBottom: "16px" }}>
          Contact ZealPlane
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.7", marginBottom: "35px" }}>
          We welcome communication from comic readers, indie authors, artists, and media partners.
          Choose the most relevant channel below to ensure your message reaches the appropriate team directly.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {/* Creator Submissions */}
          <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f47521", marginBottom: "12px", fontSize: "18px", fontWeight: "700" }}>
              <FaHeadset />
              <span>Creator Publishing</span>
            </div>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "14px" }}>
              For indie creators, manga artists, or writers seeking to self-publish their comics or serialize their webtoon chapters on ZealPlane.
            </p>
            <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
              teamzealplane@gmail.com →
            </a>
          </div>

          {/* Editorial Desk */}
          <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38bdf8", marginBottom: "12px", fontSize: "18px", fontWeight: "700" }}>
              <FaEnvelope />
              <span>Editorial & Press</span>
            </div>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "14px" }}>
              For editorial coverage, corrections, pop-culture news press releases, or creator feature interviews on ZealPlane Chronicles.
            </p>
            <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
              teamzealplane@gmail.com →
            </a>
          </div>

          {/* Legal & DMCA */}
          <div style={{ background: "rgba(30, 41, 59, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#e11d48", marginBottom: "12px", fontSize: "18px", fontWeight: "700" }}>
              <FaFileContract />
              <span>DMCA & Legal Desk</span>
            </div>
            <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "14px" }}>
              For formal copyright notices, trademark inquiries, or intellectual property verification under our DMCA compliance policy.
            </p>
            <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
              teamzealplane@gmail.com →
            </a>
          </div>
        </div>

        {/* Operating Address & Response Time */}
        <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "12px", padding: "24px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#38bdf8", marginBottom: "10px", fontSize: "16px", fontWeight: "700" }}>
            <FaBuilding />
            <span>Platform Operations & Standards</span>
          </div>
          <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.7", margin: 0 }}>
            ZealPlane is an independent digital comic publication and creator self-publishing platform registered in India.<br />
            <strong>Primary Contact Email:</strong> <a href="mailto:teamzealplane@gmail.com" style={{ color: "#38bdf8" }}>teamzealplane@gmail.com</a><br />
            <strong>Expected Response Window:</strong> 24 to 48 business hours.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
