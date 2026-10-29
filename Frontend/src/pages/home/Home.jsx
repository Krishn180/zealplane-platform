import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import ContinueReadingBanner from "../../components/ContinueReadingBanner/ContinueReadingBanner";
import EditorsPicks from "./EditorsPicks/EditorsPicks";
import NewlyReleased from "./NewlyReleased/NewlyReleased";
import Trending from "./trending/Trending";
import ActionCorner from "./ActionCorner/ActionCorner";
import HorrorCorner from "./HorrorCorner/HorrorCorner";
import ComedyCorner from "./ComedyCorner/ComedyCorner";
import Recommended from "./Recommended/Recommended";
import Curated from "./curated/Curated";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Newsletter from "../../components/Newsletter/Newsletter";
import EditorialHubSeoProse from "./EditorialHubSeoProse";
import { setUserId } from "../../store/userAction";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Home = () => {
  const [userDetails, setUserDetails] = useState(null);
  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState(null);
  const [latestNews, setLatestNews] = useState(null);
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data);
        setProfilePic(response.data.profilePic);
        localStorage.setItem("username", response.data.username);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Fetch the latest breaking news article for the alert ticker
  useEffect(() => {
    const fetchLatestArticle = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/news`);
        const articles = res.data?.articles || (Array.isArray(res.data) ? res.data : []);
        if (articles.length > 0) {
          const sorted = [...articles].sort((a, b) => {
            const dtA = new Date(a.createdAt || a.date || 0);
            const dtB = new Date(b.createdAt || b.date || 0);
            return dtB - dtA;
          });
          setLatestNews(sorted[0]);
        }
      } catch (e) {
        console.error("Error fetching latest news alert:", e);
      }
    };

    fetchLatestArticle();
  }, [apiBaseUrl]);

  // Dispatch userId to Redux store if not already set
  useEffect(() => {
    if (!userIdRedux && userIdLocalStorage) {
      dispatch(setUserId(userIdLocalStorage));
    }
  }, [dispatch, userIdRedux, userIdLocalStorage]);

  const [comicLang, setComicLang] = useState("all");

  return (
    <div className="homePage">
      <Helmet>
        <title>Read Indie Comics Online - ZealPlane | Best Manga & Graphic Novels</title>
        <meta
          name="description"
          content="Read top indie comics, manga, and graphic novels online for free on ZealPlane. Discover curated stories across Action, Horror, Comedy, and Mystery in English and Hindi."
        />
        <meta
          name="keywords"
          content="read indie comics online, globalcomix alternative, webtoon alternative, read manga online, indian comic creators, graphic novels, hindi comics online"
        />
      </Helmet>
      <Header />
      <HeroBanner />
      <ContinueReadingBanner />

      {/* ⚡ Real-Time Latest Breaking News Alert Ticker */}
      {latestNews && (
        <div className="home-news-alert-banner" style={{ maxWidth: "1200px", margin: "18px auto 0 auto", padding: "0 20px" }}>
          <Link 
            to={`/news/${latestNews.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(90deg, rgba(239, 68, 68, 0.16) 0%, rgba(249, 115, 22, 0.12) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "12px",
              padding: "10px 18px",
              textDecoration: "none",
              gap: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, overflow: "hidden" }}>
              <span style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: "6px",
                letterSpacing: "0.5px",
                flexShrink: 0
              }}>
                ⚡ JUST RELEASED
              </span>
              <span style={{ color: "#f8fafc", fontSize: "13.5px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {latestNews.title}
              </span>
            </div>
            <span style={{ color: "#f97316", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>
              Read Story →
            </span>
          </Link>
        </div>
      )}

      {/* Language Segmentation Filter & Quiet Schedule Note */}
      <div className="comic-language-selector-wrapper" style={{ maxWidth: "1200px", margin: "16px auto 10px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", background: "rgba(255, 255, 255, 0.03)", padding: "12px 18px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#8a99ad", marginRight: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Language:
            </span>
            <button
              onClick={() => setComicLang("all")}
              style={{
                background: comicLang === "all" ? "linear-gradient(90deg, #ff5e62, #ff9966)" : "rgba(255, 255, 255, 0.06)",
                color: "#fff",
                border: comicLang === "all" ? "1px solid #ff9966" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "12.5px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              All
            </button>
            <button
              onClick={() => setComicLang("en")}
              style={{
                background: comicLang === "en" ? "linear-gradient(90deg, #3a7bd5, #3a6073)" : "rgba(255, 255, 255, 0.06)",
                color: "#fff",
                border: comicLang === "en" ? "1px solid #3a7bd5" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "12.5px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              English
            </button>
            <button
              onClick={() => setComicLang("hi")}
              style={{
                background: comicLang === "hi" ? "linear-gradient(90deg, #ff8008, #ffc837)" : "rgba(255, 255, 255, 0.06)",
                color: comicLang === "hi" ? "#000" : "#fff",
                border: comicLang === "hi" ? "1px solid #ffc837" : "1px solid rgba(255, 255, 255, 0.12)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "12.5px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              हिंदी
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", fontSize: "12px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f97316" }}></span>
            <span>New chapters released regularly</span>
          </div>
        </div>
      </div>

      {/* 1. Curated Flagship Shelf */}
      <EditorsPicks comicLang={comicLang} />

      {/* 2. 🆕 Newly Released Comics & Fresh Chapter Drops */}
      <NewlyReleased comicLang={comicLang} />

      {/* 3. Overall Most Popular Across All Genres */}
      <Trending comicLang={comicLang} />

      {/* 4. Action, Superhero & Shonen Manga */}
      <ActionCorner comicLang={comicLang} />

      {/* 5. Horror, Mystery & Supernatural */}
      <HorrorCorner comicLang={comicLang} />

      {/* 6. Comedy & Classic Digest */}
      <ComedyCorner comicLang={comicLang} />

      {/* 7. Personalized Suggestions */}
      <Recommended comicLang={comicLang} />

      {/* 8. Pop-Culture News & Editorials (Sorted Newest First) */}
      <Curated />

      <EditorialHubSeoProse />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
