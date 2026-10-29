import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Auth/Axios";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Img from "../../components/lazyLoadImage/Img";
import { ExternalLink, PlayCircle, BookOpen, AlertCircle } from "lucide-react";
import "./MyLibrary.scss";

export default function MyLibrary() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for exclusive content modal
  const [activeProject, setActiveProject] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [exclusiveContent, setExclusiveContent] = useState(null);

  const userId = useSelector((state) => state.user.userId) || localStorage.getItem("Id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        if (!userId) {
          setError("Please log in to view your library.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get(`/payment/my-purchases?userId=${userId}`);
        if (res.data.success) {
          setPurchases(res.data.purchases);
        } else {
          setError("Failed to load your library.");
        }
      } catch (err) {
        console.error("Library error:", err);
        setError("Error fetching your purchases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [userId]);

  const handleOpenContent = async (project) => {
    setActiveProject(project);
    setContentLoading(true);
    try {
      const res = await axiosInstance.get(`/payment/projects/${project._id}/exclusive-content?userId=${userId}`);
      if (res.data.success) {
        setExclusiveContent(res.data.exclusiveContent);
      }
    } catch (err) {
      console.error("Failed to fetch exclusive content", err);
      setExclusiveContent(null);
    } finally {
      setContentLoading(false);
    }
  };

  const closeContentModal = () => {
    setActiveProject(null);
    setExclusiveContent(null);
  };

  if (loading) {
    return (
      <div className="my-library-loading">
        <Header />
        <div className="loader">Loading Your Library...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="my-library content-container">
        <div className="library-header">
          <h1>My Library</h1>
          <p>Access your exclusive purchased content and director's cuts.</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}

        {!error && purchases.length === 0 && (
          <div className="empty-library">
            <BookOpen className="empty-icon" />
            <h2>Your library is empty</h2>
            <p>Support creators and unlock exclusive content to see it here.</p>
            <button onClick={() => navigate("/home")} className="explore-btn">
              Explore Comics
            </button>
          </div>
        )}

        <div className="library-grid">
          {purchases.map((project) => (
            <div key={project._id} className="library-card">
              <div className="poster-block" onClick={() => navigate(`/${project._id}-detail`)}>
                <Img src={project.thumbnailImage} className="poster-img" />
                <div className="tier-badge">
                  {project.tier === "99" ? "Director's Cut" : "Insider Tier"}
                </div>
              </div>
              <div className="card-info">
                <h3>{project.name}</h3>
                <span className="creator">by {project.username}</span>
                <button 
                  className="access-btn"
                  onClick={() => handleOpenContent(project)}
                >
                  Access Exclusive Content
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exclusive Content Modal */}
      {activeProject && (
        <div className="exclusive-content-modal" onClick={closeContentModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeContentModal}>×</button>
            <h2>{activeProject.name} <span className="highlight">— Vault</span></h2>
            
            {contentLoading ? (
              <div className="content-loader">Unlocking Vault...</div>
            ) : exclusiveContent ? (
              <div className="vault-items">
                {activeProject.tier === "99" && exclusiveContent.motionComicLink && (
                  <div className="vault-item premium">
                    <PlayCircle className="item-icon" />
                    <div className="item-details">
                      <h4>Motion Comic</h4>
                      <p>Watch the fully animated, immersive cut.</p>
                    </div>
                    <a href={exclusiveContent.motionComicLink} target="_blank" rel="noopener noreferrer" className="view-btn">
                      Watch <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                {exclusiveContent.behindTheScenesDriveLink && (
                  <div className="vault-item">
                    <BookOpen className="item-icon" />
                    <div className="item-details">
                      <h4>Behind The Scenes</h4>
                      <p>Access storyboards, scripts, and rough sketches.</p>
                    </div>
                    <a href={exclusiveContent.behindTheScenesDriveLink} target="_blank" rel="noopener noreferrer" className="view-btn">
                      Open Folder <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                {(!exclusiveContent.behindTheScenesDriveLink && !exclusiveContent.motionComicLink) && (
                  <p className="no-content">The creator hasn't uploaded the exclusive links yet. Check back soon!</p>
                )}
              </div>
            ) : (
              <p className="error-text">Failed to load content. Please try again.</p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
