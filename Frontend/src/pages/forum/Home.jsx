import React, { useState, useEffect } from "react";
import PostList from "./Component/PostList";
import Header from "./Component/Header";
import Sidebar from "./Component/Sidebar";
import CuratedSidebar from "./Component/right-sidebar/right-sidebar";
import "./style.scss";
import axiosInstance from "../../Auth/Axios";
import ForumSkeleton from "./ForumSkeleton";
import ForumTavernBanner from "./Component/ForumTavernBanner";
import ForumQuickPostBox from "./Component/ForumQuickPostBox";
import Footer from "../../components/footer/Footer";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`${apiBaseUrl}/posts`);
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiBaseUrl]);

  // Client-side category filtering
  const filteredPosts = posts.filter((post) => {
    if (activeFilter === "all") return true;
    const text = `${post.title || ""} ${post.body || ""}`.toLowerCase();
    if (activeFilter === "theories") {
      return text.includes("theory") || text.includes("lore") || text.includes("twist") || text.includes("leak") || text.includes("chapter");
    }
    if (activeFilter === "art") {
      return !!post.image || text.includes("art") || text.includes("sketch") || text.includes("draw") || text.includes("cover");
    }
    if (activeFilter === "general") {
      return !text.includes("theory") && !post.image;
    }
    return true;
  });

  return (
    <div className="home-container">
      <Header />

      {loading ? (
        <ForumSkeleton />
      ) : (
        <div className="main-layout">
          <div className="sidebar-component">
            <Sidebar />
          </div>

          <div className="main-content" style={{ marginTop: "55px" }}>
            <main className="content-container">
              {/* Sleek Hero Banner with Category Filters */}
              <ForumTavernBanner 
                activeFilter={activeFilter} 
                setActiveFilter={setActiveFilter} 
              />

              {/* Compact Quick Post Trigger */}
              <ForumQuickPostBox />

              {/* Feed of Discussions */}
              <PostList 
                key={activeFilter} 
                initialPosts={filteredPosts.length > 0 ? filteredPosts : posts} 
              />
            </main>
          </div>

          <div className="curated-sidebar">
            <CuratedSidebar />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
