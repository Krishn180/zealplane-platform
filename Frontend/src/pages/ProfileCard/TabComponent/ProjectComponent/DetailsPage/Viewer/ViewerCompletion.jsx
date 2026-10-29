import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, MessageSquare, RotateCcw, Bookmark } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
const ViewerCompletion = ({ isOpen, projectId, onClose }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleDiscuss = useCallback(() => navigate("/forum"), [navigate]);

  const handleRestart = useCallback(() => {
    if (projectId) localStorage.removeItem(`vp_${projectId}`);
    onClose();
    // Scroll reader back to the very first page
    const container = document.querySelector(".viewer__container");
    if (container) container.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectId, onClose]);

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      if (!googleToken) {
        toast.error("Google login failed. No token received.");
        return;
      }

      const response = await axios.post(`${apiBaseUrl}/users/google-login`, {
        token: googleToken,
      });

      const {
        id: userId,
        username,
        token,
        refreshToken,
        profilePic,
        points = 0,
      } = response.data.user;

      localStorage.setItem("Id", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
      if (profilePic) localStorage.setItem("profilePic", profilePic);
      localStorage.setItem("points", points);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      setIsLoggedIn(true);
      toast.success(`🎉 Welcome ${username}! Chapter saved to your Library.`);
    } catch (err) {
      console.error("Google Login error:", err);
      toast.error("Google Sign-in failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="ve-completion"
      role="dialog"
      aria-modal="true"
      aria-label="You finished reading this comic"
    >
      <div className="ve-completion__card">
        <div className="ve-completion__icon-wrapper" style={{ color: "#ffd700", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
          <Trophy size={48} />
        </div>

        <h2 className="ve-completion__title">You finished it!</h2>

        <p className="ve-completion__subtitle">
          Amazing read! Join thousands of fans discussing the story,
          sharing theories, and discovering hidden easter eggs.
        </p>

        {/* Star burst animation */}
        <div className="ve-completion__stars" aria-hidden="true" style={{ display: "flex", gap: "6px", justifyContent: "center", color: "#ffd700", margin: "16px 0 20px 0" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={18} fill="#ffd700" color="#ffd700" />
          ))}
        </div>

        {/* 1-Click Library Bookmark Hook for Anonymous Finishers */}
        {!isLoggedIn ? (
          <div style={{
            margin: "0 0 20px",
            padding: "16px",
            background: "linear-gradient(135deg, rgba(230, 57, 70, 0.12), rgba(255, 140, 0, 0.08))",
            border: "1px solid rgba(230, 57, 70, 0.35)",
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", fontWeight: "800", color: "#ff8c00", marginBottom: "6px" }}>
              <Bookmark size={15} />
              <span>Save Progress to My Library</span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 12px", lineHeight: "1.4" }}>
              Keep your reading streak & get notified when the next chapter drops.
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => toast.error("Google Sign-in failed.")}
                theme="filled_black"
                shape="pill"
                text="continue_with"
              />
            </div>
          </div>
        ) : (
          <div style={{
            margin: "0 0 20px",
            padding: "10px 16px",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "8px",
            color: "#10b981",
            fontSize: "12px",
            fontWeight: "700",
            textAlign: "center"
          }}>
            ✓ Chapter bookmarked in your personal library!
          </div>
        )}

        <div className="ve-completion__actions">
          <button className="ve-btn ve-btn--primary" onClick={() => navigate(`/details/${projectId}`)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <MessageSquare size={16} />
            Rate & Leave a Comment
          </button>
          <button className="ve-btn ve-btn--secondary" onClick={handleRestart} style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
            <RotateCcw size={16} />
            Read Again from Start
          </button>
          <button className="ve-btn ve-btn--ghost" onClick={onClose}>
            Keep scrolling
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewerCompletion;
