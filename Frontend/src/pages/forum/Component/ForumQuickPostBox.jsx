import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle2, Image, Link2, HelpCircle, Brain } from "lucide-react";
import axios from "axios";
import "./ForumQuickPostBox.scss";

const ForumQuickPostBox = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const userId = localStorage.getItem("Id");
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (userId) {
      axios.get(`${apiBaseUrl}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data?.user?.profilePic) {
          setProfilePic(res.data.user.profilePic);
        }
      }).catch(err => console.error("Error fetching user details in post box:", err));
    }
  }, [userId, token, apiBaseUrl]);

  return (
    <div className="forum-quick-post-box" onClick={() => navigate("/forum/create-post")}>
      <div className="post-input-row">
        {profilePic ? (
          <img src={profilePic} alt="You" className="user-avatar" />
        ) : (
          <UserCircle2 size={34} className="user-avatar-placeholder" strokeWidth={1.5} />
        )}
        <div className="mock-input">
          Share a theory, upload your artwork, or start a debate...
        </div>
      </div>
      
      <div className="post-options-row">
        <div className="post-option">
          <Brain size={17} className="option-icon theory-color" strokeWidth={1.8} />
          <span>Post Theory</span>
        </div>
        <div className="post-option">
          <Image size={17} className="option-icon art-color" strokeWidth={1.8} />
          <span>Fan Art</span>
        </div>
        <div className="post-option">
          <Link2 size={17} className="option-icon link-color" strokeWidth={1.8} />
          <span>Link</span>
        </div>
        <div className="post-option">
          <HelpCircle size={17} className="option-icon ask-color" strokeWidth={1.8} />
          <span>Ask Guild</span>
        </div>
      </div>
    </div>
  );
};

export default ForumQuickPostBox;
