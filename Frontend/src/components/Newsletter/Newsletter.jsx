import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGift, FaFire, FaBell, FaStar, FaCopy, FaCheck } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const googleToken = credentialResponse.credential;
      if (!googleToken) {
        toast.error("Google sign-in token missing.");
        return;
      }

      const decoded = jwtDecode(googleToken);
      const userEmail = decoded.email;

      // 1. Auto Register/Login User in MongoDB users collection
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
      } catch (userErr) {
        console.warn("Google user login sync:", userErr);
      }

      // 2. Add verified email to Newsletter collection
      try {
        await axios.post(`${apiBaseUrl}/newsletter/subscribe`, { 
          email: userEmail, 
          source: "homepage_google_1click" 
        });
      } catch (nlErr) {
        await axios.post(`${apiBaseUrl}/newsletter`, { 
          email: userEmail, 
          source: "homepage_google_1click" 
        });
      }

      setEmail(userEmail);
      setIsSubscribed(true);
      toast.success(`🎉 Subscribed as ${userEmail}! Free Welcome Bundle unlocked.`);
    } catch (err) {
      console.error("Google 1-Click subscription failed:", err);
      toast.error("1-Click Google Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      let res;
      try {
        res = await axios.post(`${apiBaseUrl}/newsletter/subscribe`, { email, source: "homepage_newsletter" });
      } catch (err1) {
        res = await axios.post(`${apiBaseUrl}/newsletter`, { email, source: "homepage_newsletter" });
      }
      toast.success(res.data?.message || "Subscribed successfully!");
      setIsSubscribed(true);
    } catch (err) {
      if (err.response?.data?.message?.includes("Already")) {
        setIsSubscribed(true);
        toast.info("You're already subscribed to alerts!");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText("ZEAL_FIRST_GIFT");
    setCopied(true);
    toast.success("Promo code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="newsletter">
      <div className="newsletter-left">
        {!isSubscribed ? (
          <>
            <h2>Get 5 Free Premium Comics Instantly! 🎁</h2>
            <p>
              Subscribe to the ZealPlane inner circle today. We will immediately unlock a digital 
              welcome bundle containing exclusive behind-the-scenes sketchbooks, early-bird chapter access, 
              and discount keys for physical prints.
            </p>

            <div className="subscription-options" style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start", width: "100%", maxWidth: "420px" }}>
              <div style={{ marginTop: "6px", width: "100%" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google 1-Click Sign-in Failed")}
                  theme="filled_blue"
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              </div>

              <div className="sub-divider" style={{ margin: "8px 0 2px", width: "100%", textAlign: "center", color: "#888", fontSize: "12px", letterSpacing: "1px" }}>
                <span>OR SUBSCRIBE WITH EMAIL</span>
              </div>

              <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "CLAIMING..." : "CLAIM"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="newsletter-success-state" style={{ animation: "fadeIn 0.5s ease" }}>
            <h2>🎉 Welcome to the Universe!</h2>
            <p style={{ color: "#00ffcc", fontWeight: "bold" }}>
              We have dispatched your digital comic bundle to <strong>{email || "your Google Account"}</strong>!
            </p>
            <p>Here is your instant signup reward: copy the secret code below to unlock any premium behind-the-scenes tier for FREE!</p>
            <div className="gift-code-box" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255, 69, 0, 0.15)", padding: "12px 20px", borderRadius: "10px", border: "1px dashed #ff4500", marginTop: "15px", width: "max-content" }}>
              <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold", color: "#ff4500", letterSpacing: "1px" }}>ZEAL_FIRST_GIFT</span>
              <button onClick={copyCode} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", padding: "0" }}>
                {copied ? <FaCheck style={{ color: "#00ffcc" }} /> : <FaCopy />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="newsletter-right">
        <h4>Subscriber Privileges</h4>
        <ul>
          <li><FaGift /> Free high-res sketchbooks & wall art</li>
          <li><FaFire /> Read new chapters 24 hours early</li>
          <li><FaStar /> Members-only physical print discounts</li>
          <li><FaBell /> Zero spam, notification alerts only</li>
        </ul>
      </div>
    </div>
  );
};

export default Newsletter;

