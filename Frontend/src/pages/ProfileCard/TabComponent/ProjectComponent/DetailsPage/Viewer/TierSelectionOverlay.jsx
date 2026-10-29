import React, { useState } from "react";
import { PenTool, Zap } from "lucide-react";

const TierSelectionOverlay = ({ onSelectTier, supportLoading, onNavigateForum, userContext }) => {
  // Check if a user is logged in based on your userContext helper payload
  const isLoggedIn = userContext && userContext.userId;

  // Local guest credential tracking states
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [inputError, setInputError] = useState("");

  const handleTierClick = (tierValue) => {
    setInputError("");

    // If guest checkout is active, make sure they gave us at least one way to contact them
    if (!isLoggedIn && !guestEmail.trim() && !guestPhone.trim()) {
      setInputError("Please provide an email or phone number to unlock your secure download link!");
      return;
    }

    // Pass the tier value along with the inputted guest credentials back to the parent Viewer component trigger
    onSelectTier(tierValue, {
      email: guestEmail.trim() || null,
      phone: guestPhone.trim() || null
    });
  };

  return (
    <div className="tier-picker-wrapper" style={{ display: "block", position: "relative", width: "100%", boxSizing: "border-box", background: "#0d0d14", padding: "50px 24px 60px 24px", color: "#ffffff", textAlign: "center", zIndex: 10 }}>
      <h3 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 10px 0", color: "#ff4500", letterSpacing: "-0.5px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        Hooked on the story? Unlock the rest for just ₹1!
        <PenTool size={22} style={{ display: "inline-block", verticalAlign: "middle" }} />
      </h3>
      <p style={{ color: "#b3b3cc", fontSize: "14px", lineHeight: 1.5, marginBottom: "35px", maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>ZealPlane is run entirely by independent creators. Unlock hidden drafts, extra pages, and cinematic drops with a quick one-time contribution.</p>
      
      {/* 🌟 NEW GUEST LAZY ACCESS REGISTRATION CARD */}
      {!isLoggedIn && (
        <div style={{ maxWidth: "500px", margin: "0 auto 35px auto", backgroundColor: "#14141f", padding: "20px", borderRadius: "12px", border: "1px solid #ff450033" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "#ff4500", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
            <Zap size={14} fill="#ff4500" color="#ff4500" />
            Instant Access (No Password Needed)
          </h4>
          <p style={{ margin: "0 0 15px 0", fontSize: "12px", color: "#8c8cba" }}>Enter your details below. Your secure Google Drive vault link will match this info instantly upon payment success!</p>
          
          <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
            <input 
              type="email" 
              placeholder="Enter Email Address" 
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              style={{ padding: "12px", borderRadius: "6px", border: "1px solid #242438", backgroundColor: "#0d0d14", color: "#fff", fontSize: "14px", outline: "none" }}
            />
            <div style={{ fontSize: "12px", color: "#555" }}>— OR —</div>
            <input 
              type="tel" 
              placeholder="Enter Mobile Number (e.g., +919876543210)" 
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              style={{ padding: "12px", borderRadius: "6px", border: "1px solid #242438", backgroundColor: "#0d0d14", color: "#fff", fontSize: "14px", outline: "none" }}
            />
          </div>
          {inputError && <p style={{ color: "#ff3333", fontSize: "12px", margin: "12px 0 0 0", fontWeight: "bold" }}>{inputError}</p>}
        </div>
      )}

      <div style={{ display: "flex", gap: "24px", justifyContent: "center", maxWidth: "750px", margin: "0 auto 30px auto", flexWrap: "wrap" }}>
        
        {/* TIER 1: ₹49 ULTIMATE BUNDLE */}
        <div style={{ backgroundColor: "#17121a", border: "2px solid #ff4500", borderRadius: "12px", padding: "24px", width: "320px", textAlign: "left", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 8px 30px rgba(255, 69, 0, 0.15)" }}>
          <div style={{ position: "absolute", top: "-12px", right: "16px", backgroundColor: "#ff4500", color: "#ffffff", fontSize: "10px", fontWeight: 900, padding: "4px 10px", borderRadius: "20px", letterSpacing: "0.5px" }}>BEST VALUE</div>
          <h4 style={{ margin: "0 0 6px 0", color: "#ffffff", fontSize: "17px", fontWeight: 700 }}>The Ultimate Bundle</h4>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "#ff4500", marginBottom: "18px", display: "flex", alignItems: "baseline", gap: "6px" }}>₹1 <span style={{ fontSize: "12px", color: "#8c8cba", fontWeight: 400 }}>one-time drop</span></div>
          <ul style={{ paddingLeft: "18px", margin: "0 0 24px 0", fontSize: "13px", color: "#c2c2d6", flexGrow: 1, lineHeight: 1.6, listStyle: "none" }}>
            <li style={{ marginBottom: "10px", position: "relative", paddingLeft: "20px" }}>
              <span style={{ position: "absolute", left: 0, top: "3px", color: "#ff4500" }}>
                <Zap size={12} fill="#ff4500" color="#ff4500" />
              </span>
              <strong>Full Comic Book</strong> access & additional free comics.
            </li>
            <li style={{ marginBottom: "10px", position: "relative", paddingLeft: "20px" }}>
              <span style={{ position: "absolute", left: 0, top: "3px", color: "#8c8cba" }}>
                <Zap size={12} fill="#8c8cba" color="#8c8cba" />
              </span>
              5 free chapters from the <strong>GOD light novel</strong>.
            </li>
            <li style={{ marginBottom: "10px", position: "relative", paddingLeft: "20px" }}>
              <span style={{ position: "absolute", left: 0, top: "3px", color: "#8c8cba" }}>
                <Zap size={12} fill="#8c8cba" color="#8c8cba" />
              </span>
              <strong>15% Discount</strong> on purchasing hard copy of comics.
            </li>
            <li style={{ marginBottom: "10px", position: "relative", paddingLeft: "20px" }}>
              <span style={{ position: "absolute", left: 0, top: "3px", color: "#8c8cba" }}>
                <Zap size={12} fill="#8c8cba" color="#8c8cba" />
              </span>
              Access to all upcoming <strong>premium content</strong> & business strategy features.
            </li>
          </ul>
          <button onClick={() => handleTierClick("1")} disabled={supportLoading} style={{ width: "100%", padding: "12px", fontSize: "14px", fontWeight: 700, borderRadius: "8px", cursor: "pointer", textAlign: "center", backgroundColor: "#ff4500", color: "#ffffff", border: "none", boxShadow: "0 4px 15px rgba(255, 69, 0, 0.3)" }}>{supportLoading ? "Opening Vault..." : "Get Ultimate Access"}</button>
        </div>

      </div>

      <button onClick={onNavigateForum} style={{ background: "none", border: "none", color: "#8c8cba", textDecoration: "underline", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>Skip for now, take me to the fan community discussion boards</button>
    </div>
  );
};

export default React.memo(TierSelectionOverlay);