import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bell, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./ChapterAlertBox.scss";

const ChapterAlertBox = ({ 
  seriesName = "", 
  source = "general", 
  title = "", 
  subtitle = "",
  isGoogleRRM = false,
  googleRRMId = ""
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api";

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const googleToken = credentialResponse.credential;
      if (!googleToken) return;

      const decoded = jwtDecode(googleToken);
      const userEmail = decoded.email;

      try {
        const userRes = await axios.post(`${apiBaseUrl}/users/google-login`, { token: googleToken });
        if (userRes.data?.user) {
          const { id, username, token, profilePic, points } = userRes.data.user;
          localStorage.setItem("Id", id);
          localStorage.setItem("username", username);
          localStorage.setItem("token", token);
          if (profilePic) localStorage.setItem("profilePic", profilePic);
          if (points) localStorage.setItem("points", points);
        }
      } catch (err) {
        console.warn("User google login:", err);
      }

      try {
        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, {
          email: userEmail,
          seriesName: seriesName || "ZealPlane Originals",
          source: source || "reader_chapter_alert_google"
        });
      } catch (_) {}

      setEmail(userEmail);
      setIsSubmitted(true);
      toast.success(`🎉 You're on the VIP alert list as ${userEmail}!`);
    } catch (err) {
      console.error("Google alert sign-in error:", err);
      toast.error("1-Click Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        seriesName: seriesName || "ZealPlane Originals",
        source: source || "reader_endcard"
      };

      try {
        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, payload);
      } catch (postErr) {
        await axios.post(`${apiBaseUrl}/newsletter`, payload);
      }

      setIsSubmitted(true);
      toast.success("🎉 You're on the VIP alert list!");
    } catch (err) {
      console.error("Subscription error:", err);
      if (err.response?.data?.message?.includes("Already")) {
        setIsSubmitted(true);
        toast.info("You're already subscribed to alerts!");
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chapter-alert-card">
      <div className="alert-card-glow" />
      <div className="alert-card-content">
        {isGoogleRRM ? (
          <>
            <div className="alert-badge-row">
              <span className="alert-badge">
                <Bell size={14} className="bell-icon" />
                <span>Instant Newsletter Updates</span>
              </span>
            </div>

            <h3 className="alert-title">
              {title || "Stay Updated on Comics & Manga"}
            </h3>

            <p className="alert-desc">
              {subtitle || "Get weekly updates on new chapters, creator spotlights, and community news."}
            </p>

            <div className="google-rrm-inline-wrapper" style={{ width: "100%", marginTop: "16px", minHeight: "100px" }}>
              <div rrm-inline-cta={googleRRMId}></div>
            </div>
          </>
        ) : !isSubmitted ? (
          <>
            <div className="alert-badge-row">
              <span className="alert-badge">
                <Bell size={14} className="bell-icon" />
                <span>Instant Chapter Alerts</span>
              </span>
            </div>

            <h3 className="alert-title">
              {title || (seriesName ? `Get notified when the next chapter of ${seriesName} drops!` : "Never miss the next chapter drop & manga leak!")}
            </h3>

            <p className="alert-desc">
              {subtitle || "Join our reader circle. We'll send you a direct notification the second new chapters and exclusive story breakdowns go live."}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", width: "100%" }}>
              <div style={{ marginTop: "4px" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Sign-in Failed")}
                  theme="filled_blue"
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              </div>

              <div style={{ color: "#64748b", fontSize: "11px", letterSpacing: "0.5px" }}>OR ENTER EMAIL MANUAL</div>

              <form className="alert-form" onSubmit={handleSubmit} style={{ width: "100%" }}>
                <div className="input-group">
                  <input
                    type="email"
                    className="alert-input"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button type="submit" className="alert-submit-btn" disabled={loading}>
                    {loading ? (
                      <span className="btn-spinner">Subscribing...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Get Free Alerts</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="alert-trust-footer">
              <ShieldCheck size={13} />
              <span>100% Free · Zero Spam · Instant 1-Click Unsubscribe Anytime</span>
            </div>
          </>
        ) : (
          <div className="alert-success-box">
            <CheckCircle2 size={36} className="success-icon" />
            <h4>🎉 You're Officially on the VIP Alert List!</h4>
            <p>
              We will email <strong>{email}</strong> the second <strong>{seriesName || "the next chapter"}</strong> is released.
            </p>
            <span className="success-tagline">Happy Reading on ZealPlane! 🚀</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterAlertBox;
