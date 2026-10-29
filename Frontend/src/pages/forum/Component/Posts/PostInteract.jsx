import React from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import "./PostInteraction.scss";

const PostInteractions = ({
  post,
  userVote,
  handleVote,
  commentCount,
  votesCount,
}) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Could not copy link."));
  };

  return (
    <div className="post-votes">
      <button
        className={`vote-button upvote ${userVote === "upvote" ? "active" : ""}`}
        onClick={() => handleVote("upvote")}
      >
        <ThumbsUp size={16} strokeWidth={2} />
      </button>

      <span className="vote-count">{votesCount}</span>

      <button className="vote-button comment">
        <MessageCircle size={16} strokeWidth={2} />
        <span className="comment-count">{commentCount}</span>
      </button>

      <button className="vote-button share" onClick={handleShare}>
        <Share2 size={16} strokeWidth={2} />
      </button>
    </div>
  );
};

export default PostInteractions;
