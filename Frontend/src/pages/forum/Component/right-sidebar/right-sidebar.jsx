import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Zap, MessageSquare, ShieldCheck, Flame } from "lucide-react";
import axios from "axios";
import "./right-sidebar.scss";

const CuratedSidebar = () => {
  const [recentNews, setRecentNews] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Fetch latest news
    axios.get(`${apiBaseUrl}/news?limit=3`)
      .then(res => {
        if (res.data && res.data.articles) {
          setRecentNews(res.data.articles.slice(0, 3));
        } else if (Array.isArray(res.data)) {
          setRecentNews(res.data.slice(0, 3));
        }
      })
      .catch(err => console.error("Error fetching news in sidebar:", err));

    // Fetch latest discussions
    axios.get(`${apiBaseUrl}/posts`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRecentPosts(res.data.slice(0, 3));
        }
      })
      .catch(err => console.error("Error fetching posts in sidebar:", err));
  }, [apiBaseUrl]);

  return (
    <div className="curated-sidebar-container">
      {/* 1. FEATURED ORIGINAL COMICS */}
      <div className="curated-sidebar-box">
        <div className="box-header-title">
          <BookOpen size={16} className="title-icon icon-comics" />
          <h3>Popular Comics on ZealPlane</h3>
        </div>
        <div className="mini-comic-list">
          <Link to="/details/6a60d6370cb3db69eafea318-karma" className="mini-comic-item">
            <img 
              src="https://res.cloudinary.com/datgyuhmy/image/upload/v1784731190/project_images/1784731189062-WhatsApp-Image-2026-04-25-at-11.jpg" 
              alt="Karma" 
              className="mini-thumb" 
            />
            <div className="mini-info">
              <span className="comic-title">Karma</span>
              <span className="comic-meta">Dark Fantasy · Action</span>
            </div>
          </Link>

          <Link to="/details/6a6cb052b666434fc607cc3c-prana-english-chapter-1" className="mini-comic-item">
            <img 
              src="https://res.cloudinary.com/datgyuhmy/image/upload/v1785507824/comics/prana/cover/prana_cover.webp" 
              alt="PRANA!" 
              className="mini-thumb" 
            />
            <div className="mini-info">
              <span className="comic-title">PRANA!</span>
              <span className="comic-meta">Mythology · Superhero</span>
            </div>
          </Link>

          <Link to="/details/6a770154adc3e27012ff8608-chullu-parilok-me" className="mini-comic-item">
            <img 
              src="https://res.cloudinary.com/datgyuhmy/image/upload/v1786183992/project_images/hpkoqjbvbddzb4vgyrug.jpg" 
              alt="Chullu Parilok Me" 
              className="mini-thumb" 
            />
            <div className="mini-info">
              <span className="comic-title">Chullu Parilok Me</span>
              <span className="comic-meta">Swapnil Comics · Comedy</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. TRENDING ANIME & GAMING NEWS */}
      {recentNews.length > 0 && (
        <div className="curated-sidebar-box">
          <div className="box-header-title">
            <Zap size={16} className="title-icon icon-news" />
            <h3>Latest Anime &amp; Manga News</h3>
          </div>
          <ul className="sidebar-news-list">
            {recentNews.map(item => (
              <li key={item._id || item.slug} className="news-mini-item">
                <Link to={`/news/${item.slug}`}>
                  <span className="news-item-title">{item.title}</span>
                  <span className="news-item-date">
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. COMMUNITY ETIQUETTE & GUIDELINES */}
      <div className="curated-sidebar-box rules-box">
        <div className="box-header-title">
          <ShieldCheck size={16} className="title-icon icon-rules" />
          <h3>Community Rules</h3>
        </div>
        <ul className="rules-bullet-list">
          <li>✨ Be respectful to artists &amp; creators</li>
          <li>🤐 Tag plot spoilers appropriately (#Spoiler)</li>
          <li>🎨 Give proper credit when sharing fan-art</li>
          <li>🚀 Have fun debating theories!</li>
        </ul>
      </div>
    </div>
  );
};

export default CuratedSidebar;
