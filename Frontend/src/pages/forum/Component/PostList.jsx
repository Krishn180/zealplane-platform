import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUp, MessageCircle, Share2 } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import linkifyHtml from "linkify-html";
import { toast } from "react-toastify";
import "./postList.scss";

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // special chars hatao
    .replace(/\s+/g, "-"); // space ko dash me badlo

const PostList = ({ initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Could not copy link."));
  };

  const handleUpvote = async (postId, isUpvoted) => {
    try {
      if (!token) {
        toast.error(
          "You are not authorized to perform this action. Please log in."
        );
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentUserId = decodedToken.uniqueId;

      await axios.put(
        `${apiBaseUrl}/posts/votes/${postId}`,
        { voteType: isUpvoted ? 0 : 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                votes: isUpvoted
                  ? post.votes.filter((vote) => vote !== currentUserId)
                  : [...post.votes, currentUserId],
                upvoted: !isUpvoted,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling vote:", error);
    }
  };

  return (
    <div className="post-list">
      {posts.map((post) => {
        const isUpvoted = post.upvoted || false;
        const voteCount = post.votes.length || 0;

        return (
          <Link
            to={`/post/${slugify(post.title)}-${post._id}`}
            key={post._id}
            className="post-link"
          >
            <div className="post">
              <div className="post-header">
                {post.profilePic ? (
                  <img
                    src={post.profilePic}
                    alt="Profile"
                    className="profile-pic"
                  />
                ) : (
                  <div className="profile-pic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#374151', color: '#9ca3af', fontWeight: 'bold' }}>
                    {(post.author || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="post-title-container">
                  <h3 className="post-title">
                    {post.title || "No title available"}
                  </h3>
                  <div className="post-meta-sub">
                    <span className="post-author">{post.author || "Anonymous"}</span>
                    <span className="post-dot">•</span>
                    <span className="post-timestamp">
                      {post.timestamp
                        ? new Date(post.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              {post.image && (
                <div className="post-image-container">
                  <img src={post.image} alt="Post" className="post-image" />
                </div>
              )}

              <PostBody body={linkifyHtml(post.body)} />

              <div className="post-meta">
                <div
                  className="post-upvote"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpvote(post._id, isUpvoted);
                  }}
                >
                  <ArrowUp
                    size={16}
                    className={`upvote-icon ${isUpvoted ? "active" : ""}`}
                    strokeWidth={2.5}
                  />
                  <span className="vote-count">{voteCount}</span>
                </div>
                <span className="post-comments">
                  <MessageCircle size={14} strokeWidth={2} />{" "}
                  {Array.isArray(post.comments) ? post.comments.length : 0}{" "}
                  Comments
                </span>
                <span
                  className="post-share"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare(post._id);
                  }}
                >
                  <Share2 size={14} strokeWidth={2} /> Share
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const PostBody = ({ body }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => setIsExpanded((prev) => !prev);

  const formatContent = (text, truncate = false) => {
    if (!text) return "No content available";

    const words = text.trim().split(/\s+/); // Split the body text into words

    if (truncate && words.length > 20) {
      return words.slice(0, 20).join(" ") + "..."; // Truncate to 20 words
    }

    return text; // Return full text if not truncated
  };

  const shouldTruncate = body && body.split(/\s+/).length > 20; // Truncate if more than 20 words

  return (
    <div className="post-body-container">
      <p
        className="post-body"
        dangerouslySetInnerHTML={{
          __html: isExpanded ? body : formatContent(body, true),
        }}
        style={{ whiteSpace: "pre-wrap" }}
      ></p>
      {shouldTruncate && (
        <button
          onClick={toggleContent}
          className={isExpanded ? "read-less-button" : "read-more-button"}
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default PostList;
