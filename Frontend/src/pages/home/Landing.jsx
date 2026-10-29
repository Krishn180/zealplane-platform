import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./style.scss";
import AboutCard from "../../AboutCard/AboutCard";
import Ourcreator from "./OurCreator/Ourcreator";
import Navbar from "../../AboutCard/Navbar";
import Footer from "../../components/footer/Footer";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setUserId } from "../../store/userAction";

// ── NEW cinematic landing sections ──
import LandingCinematicHero from "./LandingCinematicHero";
import ContinueReadingBanner from "../../components/ContinueReadingBanner/ContinueReadingBanner";
import LandingTrendingStrip from "./LandingTrendingStrip";
import LandingScheduleCard from "./LandingScheduleCard";
import LandingValueProps from "./LandingValueProps";
import LandingStatsBar from "./LandingStatsBar";
import LandingUseCasesAndFaq from "./LandingUseCasesAndFaq";
import LandingCtaBanner from "./LandingCtaBanner";
import EditorialHubSeoProse from "./EditorialHubSeoProse";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasAuthToken = typeof window !== "undefined" && (!!localStorage.getItem("token") || !!localStorage.getItem("refreshToken"));
  const [loading, setLoading] = useState(hasAuthToken);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Already logged in, no need to refresh
      navigate("/home");
      return;
    }

    const checkRefreshToken = async () => {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          "https://api.zealplane.com/api/refresh-token",
          { refreshToken }
        );
        const { token, userId, username: directUsername, user } = response.data;
        const username = directUsername || user?.username || "Guest";

        localStorage.setItem("token", token);
        localStorage.setItem("Id", userId);
        localStorage.setItem("username", username);

        dispatch(setUserId(userId));
        navigate("/home");
      } catch (error) {
        // Token invalid or expired
        console.log("Refresh token invalid:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setLoading(false);
      }
    };

    checkRefreshToken();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a12", minHeight: "100vh" }}>
      <Helmet>
        <title>ZealPlane – Read & Discover Indie Comics Online</title>
        <meta name="description" content="ZealPlane is India's premier indie comic book platform. Read original comics, manga-style stories, and graphic novels from independent creators." />
      </Helmet>
      <Navbar />
      <LandingCinematicHero />
      <ContinueReadingBanner />
      <LandingTrendingStrip />
      
      {/* 📅 Official Drop Calendar on Front Landing Page */}
      <LandingScheduleCard />

      <LandingValueProps />
      <LandingStatsBar />
      <AboutCard />
      <Ourcreator />
      <LandingUseCasesAndFaq />
      <LandingCtaBanner />
      <EditorialHubSeoProse />
      <Footer />
    </div>
  );
};

export default Landing;
