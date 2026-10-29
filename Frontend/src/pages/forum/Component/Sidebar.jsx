import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, BookOpen, Zap, PlusCircle, BookmarkCheck } from "lucide-react";
import "./Sidebar.scss";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-header-label">COMMUNITY NAV</span>
        
        <Link 
          to="/forum" 
          className={`sidebar-link ${location.pathname === "/forum" ? "active" : ""}`}
        >
          <MessageSquare size={18} className="icon icon-forum" />
          <span>Discussions</span>
        </Link>
        
        <Link 
          to="/home" 
          className={`sidebar-link ${location.pathname === "/home" ? "active" : ""}`}
        >
          <BookOpen size={18} className="icon icon-comics" />
          <span>Read Comics</span>
        </Link>
        
        <Link 
          to="/news" 
          className={`sidebar-link ${location.pathname.startsWith("/news") ? "active" : ""}`}
        >
          <Zap size={18} className="icon icon-news" />
          <span>Anime News</span>
        </Link>

        <Link 
          to="/forum/create-post" 
          className={`sidebar-link ${location.pathname === "/forum/create-post" ? "active" : ""}`}
        >
          <PlusCircle size={18} className="icon icon-create" />
          <span>New Thread</span>
        </Link>

        <Link 
          to="/my-library" 
          className={`sidebar-link ${location.pathname === "/my-library" ? "active" : ""}`}
        >
          <BookmarkCheck size={18} className="icon icon-library" />
          <span>My Library</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
