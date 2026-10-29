import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./postdetail.scss";
import Header from "./Component/Header";
import PostInfo from "./Component/Posts/PostInfo";
import PostInteractions from "./Component/Posts/PostInteract";
import CommentsSection from "./Component/Posts/CommentsSection";
import Sidebar from "./Component/Sidebar";
import axiosInstance from "../../Auth/Axios";
import { jwtDecode } from "jwt-decode";
import CuratedSidebar from "./Component/right-sidebar/right-sidebar";
import ForumSkeleton from "./ForumSkeleton";
import { ChevronLeft } from "lucide-react";
import Footer from "../../components/footer/Footer";

const PostDetail = () => {
  const { slug } = useParams();
  
  // Extract ID robustly
  const id = slug ? slug.split("-").pop() : "";
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [status, setStatus] = useState("visitor");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const getCurrentUserId = () => {
    try {
      if (!token) return null;
      const decodedToken = jwtDecode(token);
      return decodedToken?.uniqueId || null;
    } catch (error) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // Fetch post data for public or logged-in users
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPost = async () => {
      try {
        setLoading(true);
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(`${apiBaseUrl}/posts/${id}`, config);

        if (response.data && response.data.post) {
          setPost({
            ...response.data.post,
            votes: response.data.post.votes || [],
          });
          setStatus(response.data.status || "visitor");
          setComments(response.data.post.comments || []);
        } else if (response.data) {
          setPost(response.data);
          setComments(response.data.comments || []);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
        toast.error("Could not load the discussion post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserVote = async () => {
      if (!token || !id) return;
      try {
        const res = await axiosInstance.get(`${apiBaseUrl}/posts/${id}/vote`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasVoted(res.data.hasVoted);
        if (res.data.hasVoted) {
          setUserVote(res.data.voteValue > 0 ? "upvote" : "downvote");
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    if (id) {
      fetchPost();
      fetchUserVote();
    }
  }, [id, token, apiBaseUrl]);

  const handleVote = async (voteType) => {
    if (!token) {
      toast.info("Please login to upvote this discussion!");
      navigate("/login");
      return;
    }

    try {
      const voteValue = voteType === "upvote" ? 1 : -1;
      const checkUserVoteResponse = await axios.get(
        `${apiBaseUrl}/posts/${id}/vote`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { hasVoted: alreadyVoted, voteValue: userVoteValue } = checkUserVoteResponse.data;

      if (alreadyVoted && userVoteValue === voteValue) {
        setUserVote(null);
        setPost((prev) => ({
          ...prev,
          votes: (prev.votes || []).filter((vote) => vote.uniqueId !== currentUserId),
          votesCount: Math.max(0, (prev.votesCount || 1) - 1),
        }));
      } else {
        setUserVote(voteType);
        setPost((prev) => {
          const updatedVotes = [...(prev.votes || [])];
          const index = updatedVotes.findIndex(
            (vote) => vote.uniqueId === currentUserId
          );

          if (index >= 0) {
            updatedVotes[index].value = voteValue;
          } else {
            updatedVotes.push({ uniqueId: currentUserId, value: voteValue });
          }

          return {
            ...prev,
            votes: updatedVotes,
            votesCount:
              (prev.votesCount || 0) +
              (alreadyVoted ? voteValue - userVoteValue : voteValue),
          };
        });
      }

      await axios.put(
        `${apiBaseUrl}/posts/votes/${id}`,
        { voteType: voteValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Vote updated!");
    } catch (error) {
      toast.error("An error occurred while voting.");
    }
  };

  const handleEditPost = async (updatedData) => {
    try {
      const response = await axiosInstance.put(
        `${apiBaseUrl}/posts/${post._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Post updated successfully!");
      setPost(response.data.updatedPost || response.data);
    } catch (error) {
      toast.error("Failed to update the post!");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axiosInstance.delete(`${apiBaseUrl}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully!");
      navigate("/forum");
    } catch (error) {
      toast.error("Failed to delete the post!");
    }
  };

  if (loading || !post) return <ForumSkeleton />;

  const votesCount = post.votes ? post.votes.length : 0;

  return (
    <div className="home-container">
      <Header />
      <div className="main-layout">
        <div className="sidebar-component">
          <Sidebar />
        </div>

        <div className="main-content" style={{ marginTop: "55px" }}>
          <main className="content-container">
            <div className="post-detail-wrapper" style={{ width: "100%", maxWidth: "756px", margin: "10px auto 30px auto" }}>
              <Link to="/forum" className="back-to-discussions-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600", marginBottom: "16px" }}>
                <ChevronLeft size={16} /> Back to All Discussions
              </Link>

              <PostInfo
                post={post}
                status={status}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
              
              <PostInteractions
                post={post}
                userVote={userVote}
                handleVote={handleVote}
                commentCount={comments.length}
                votesCount={votesCount}
                hasVoted={hasVoted}
              />
              
              <CommentsSection
                comments={comments}
                setComments={setComments}
                postId={id}
              />
            </div>
          </main>
        </div>

        {/* Clean Content-Focused Sidebar */}
        <div className="curated-sidebar">
          <CuratedSidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostDetail;
