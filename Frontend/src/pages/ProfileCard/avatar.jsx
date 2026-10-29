import React, { useState, useEffect } from "react";
import { Col, Row, Upload, Avatar, Button, Modal, Spin, message } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import "./avatar.scss";
import RadarChartExample from "./radar";
import ProfileCard from "./ProfileCard";
import TabComponent from "./TabComponent/Tabs";
import { useSelector } from "react-redux";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { setUserId } from "../../store/userAction"; // Import the action to set userId
import { useDispatch } from "react-redux"; // Import useDispatch hook
import Header from "../../components/header/Header";
import { FaTimes, FaEdit } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import ProfileImageUploadModal from "./ProfileImageUploadModal/ProfileImageUploadModal";
import axiosInstance from "../../Auth/Axios";
import EnquiryModal from "./EnquiryModal/EnquiryModal";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/footer/Footer";
import SupportModal from "../payment/SupportModal";

const AvatarComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState("postroom");
  const [isEditMode, setIsEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const user = useSelector((state) => state.user.user);
  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState(null);
  const [response, setResponse] = useState("");
  const { id } = useParams();
  const [email, setEmail] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const handleEnquiryOpen = () => setIsEnquiryModalOpen(true);
  const handleEnquiryClose = () => setIsEnquiryModalOpen(false);
  const [status, setStatus] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const displayLevel = typeof userDetails?.level === 'object' && userDetails?.level !== null 
    ? (userDetails.level.current ?? 1) 
    : (userDetails?.level ?? 1);

  useEffect(() => {
    console.log("User ID:", id);
  }, [id]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axiosInstance.get(`users/${id}`, {
          headers: headers,
        });

        console.log("User details fetched:", response.data.user);
        setUserDetails(response.data.user);
        setEmail(response.data.user.email);
        setMobile(response.data.contactNumber);
        setResponse(response.data);
        setProfilePic(response.data.user.profilePic);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  // Fetch project count dynamically
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (userDetails?.username) {
          const res = await axiosInstance.get(`/projects/username/${userDetails.username}`);
          setProjectCount(res.data?.length || 0);
        }
      } catch (err) {
        console.error("Error fetching projects count:", err);
      }
    };
    if (userDetails?.username) {
      fetchProjects();
    }
  }, [userDetails?.username]);

  const openModal = () => {
    if (response?.status !== "visitor") {
      setModalVisible(true);
    } else {
      alert("You are not authorized to update this profile picture.");
    }
  };

  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      setImageLink(info.file.response.url);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("profilePic", file);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        alert("Access token is missing. Please log in again.");
        return;
      }

      const response = await axios.put(
        `${apiBaseUrl}/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserDetails(response.data);
      setProfilePic(response.data.profilePic);
      setLoading(false);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      setLoading(false);
      alert("Failed to update user");
    }
  };

  useEffect(() => {
    if (!userIdRedux && userIdLocalStorage) {
      dispatch(setUserId(userIdLocalStorage));
    }
  }, [dispatch, userIdRedux, userIdLocalStorage]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}/followers`);
        const followingIds = res.data.map((u) => u._id);
        setIsFollowing(followingIds.includes(userId));
      } catch (err) {
        console.error("Error checking follow status", err);
      }
    };

    if (userId && id) checkFollowStatus();
  }, [userId, id]);

  const handleSendConnectionRequest = async () => {
    try {
      const response = await axiosInstance.post(`users/toggle-follow`, {
        senderId: userId,
        receiverId: id,
      });

      toast.success(response.data.msg);
      setIsFollowing((prev) => !prev);

      // Refresh details to update counts instantly
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axiosInstance.get(`users/${id}`, { headers });
      setUserDetails(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to toggle follow status");
    }
  };

  return (
    <div className="profile-page-root">
      <Header />

      {/* 1. Cinematic Banner and Header */}
      <div className="profile-banner-container">
        <div
          className="profile-cover-banner"
          style={{
            backgroundImage: userDetails?.Background
              ? `url(${userDetails.Background})`
              : "linear-gradient(135deg, #09090e 0%, #151324 50%, #06060a 100%)",
          }}
        >
          <div className="profile-banner-overlay" />
        </div>

        <ContentWrapper>
          <div className="profile-header-details">
            {/* Avatar block with level ring */}
            <div className="profile-avatar-wrapper">
              <div className={`avatar-glow-ring level-tier-${Math.min(Math.max(displayLevel, 1), 6)}`}>
                {profilePic ? (
                  <Avatar
                    size={140}
                    src={imageLink || profilePic}
                    className="profile-main-avatar"
                    onClick={openModal}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Avatar
                    size={140}
                    icon={<UserOutlined />}
                    className="profile-main-avatar"
                    onClick={openModal}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </div>
              {status !== "visitor" && (
                <button className="change-avatar-badge" onClick={openModal} title="Change Profile Picture">
                  <FiCamera size={14} />
                </button>
              )}
            </div>

            {/* Profile Meta Info */}
            <div className="profile-text-meta">
              <div className="name-level-row">
                <h1 className="profile-fullname">
                  {userDetails?.fullName || "User Name"}
                </h1>
                <span className="profile-level-badge">
                  LVL {displayLevel}
                </span>
              </div>
              <p className="profile-username">@{userDetails?.username || "username"}</p>
              {userDetails?.jobRole && <p className="profile-job-role">{userDetails.jobRole}</p>}

              {/* Creator Statistics Strip */}
              <div className="profile-stats-strip">
                <div className="stat-box">
                  <span className="stat-val">{userDetails?.followers?.length || 0}</span>
                  <span className="stat-lbl">Followers</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val">{userDetails?.following?.length || 0}</span>
                  <span className="stat-lbl">Following</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val">{userDetails?.totalLikes || 0}</span>
                  <span className="stat-lbl">Likes</span>
                </div>
                <div className="stat-box">
                  <span className="stat-val">{projectCount}</span>
                  <span className="stat-lbl">Projects</span>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="profile-header-actions">
              {status === "visitor" && (
                <Button
                  type="button"
                  className={`action-btn follow-btn ${isFollowing ? "following" : ""}`}
                  onClick={handleSendConnectionRequest}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
              <Button
                type="button"
                className="action-btn enquiry-btn"
                onClick={handleEnquiryOpen}
              >
                Enquiry
              </Button>
              <SupportModal>
                <Button type="button" className="action-btn support-btn">
                  Support
                </Button>
              </SupportModal>
            </div>
          </div>
        </ContentWrapper>
      </div>

      {/* 2. Page Content: Tabs and Side Metadata */}
      <ContentWrapper>
        <div className="profile-grid-layout">
          {/* Main Content Area: Tab Component */}
          <div className="profile-main-column">
            <div className="glass-card main-tabs-card">
              <TabComponent
                activeTabKey={activeTabKey}
                onTabChange={handleTabChange}
              />
            </div>
          </div>

          {/* Sidebar Area: ProfileCard (Bio) and Rewards */}
          <div className="profile-sidebar-column">
            <div className="glass-card sidebar-bio-card">
              <h3 className="sidebar-card-title">About Creator</h3>
              <ProfileCard />
            </div>

            <div className="glass-card sidebar-rewards-card">
              <h3 className="sidebar-card-title">Rewards</h3>
              <div className="radar-chart-container">
                <RadarChartExample />
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>

      {/* Modals & Popups */}
      <ProfileImageUploadModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        handleFileChange={handleFileChange}
        handleFormSubmit={handleFormSubmit}
        loading={loading}
        profilePic={profilePic}
        setFile={setFile}
      />
      <EnquiryModal
        open={isEnquiryModalOpen}
        onClose={handleEnquiryClose}
        mobileNumber={mobile}
        emailAddress={email}
      />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      <Footer />
    </div>
  );
};

export default AvatarComponent;
