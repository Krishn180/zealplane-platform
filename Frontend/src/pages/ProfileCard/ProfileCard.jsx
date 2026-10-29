import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "antd";
import { FaTimes, FaEdit } from "react-icons/fa";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { setUserId } from "../../store/userAction";
import "./avatar.scss";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../Auth/Axios";
import { FaMapMarkerAlt } from "react-icons/fa";

Modal.setAppElement("#root");

const ProfileCard = () => {
  const userIdRedux = useSelector((state) => state.user.userId);
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");

  const [data, setData] = useState({
    username: "",
    jobRole: "",
    description: "",
    location: "",
    fullName: "",
    status: "", // Add status here
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: data.fullname,
    jobRole: data.jobRole,
    description: data.description,
    location: data.location,
  });
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch token from localStorage
        const userIdToFetch = id || userId;

        // Set up the request headers, including token if available
        const headers = token ? { Authorization: `Bearer ${token}` } : {}; // No token in the headers if not available

        const response = await axiosInstance.get(`users/${userIdToFetch}`, {
          headers,
        });

        console.log("User data is:", response.data);

        const { fullName, description, jobRole, location, status } =
          response.data.user;
        setStatus(response.data);

        setData({
          fullName: fullName || "Update Your Full Name",
          description: description || "Update Description!",
          jobRole: jobRole || "Update Profession",
          location: location || "Update Location",
        });

        setFormData({
          fullname: fullName || "",
          jobRole: jobRole || "",
          location: location || "",
          description: description || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized access. Please log in.");
        } else {
          toast.error("Failed to fetch user data. Please try again.");
        }
      }
    };

    fetchUserData();
  }, [id, userId]);

  useEffect(() => {
    if (!userIdRedux && userIdLocalStorage) {
      dispatch(setUserId(userIdLocalStorage));
    }
  }, [dispatch, userIdRedux, userIdLocalStorage]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveButtonClick = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.put(
        `/users/${userId}`,
        {
          fullName: formData.fullname,
          jobRole: formData.jobRole,
          location: formData.location,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User data updated:", response.data);
      toast.success("Your description updated successfully!");
      setData({
        ...data,
        fullName: formData.fullname,
        jobRole: formData.jobRole,
        location: formData.location,
        description: formData.description,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Description update failed! Please try again.");
    }
  };

  const customStyles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: window.innerWidth <= 768 ? "90%" : "480px",
      backgroundColor: "#11111d",
      color: "#fff",
      padding: "30px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "12px",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
      outline: "none",
    },
  };

  return (
    <div className="profile-card-container">
      <ToastContainer />
      <div
        className="card-content-box"
        style={{
          background: "transparent",
          color: "white",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h4 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 6px 0", color: "#fff" }}>{data.fullName}</h4>
            <p style={{ color: "#06b6d4", fontSize: "14px", fontWeight: "600", margin: "0 0 16px 0" }}>
              {data.jobRole}
              <br />
              <span style={{ color: "#9aa0b0", fontSize: "12px", fontWeight: "400", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                <FaMapMarkerAlt />
                {data.location}
              </span>
            </p>
          </div>
          {status.status !== "visitor" && (
            <Button 
              className="Edit-btn" 
              onClick={handleEditClick}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "6px",
              }}
            >
              <FaEdit />
            </Button>
          )}
        </div>

        <h5 style={{ fontWeight: "600", fontSize: "14px", color: "#ff4f00", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px 0" }}>
          Biography
        </h5>
        <p style={{ color: "#d1d5da", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
          {data.description}
        </p>
      </div>

      <Modal
        isOpen={isEditing}
        onRequestClose={handleCancelClick}
        contentLabel="Edit Modal"
        style={customStyles}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#fff" }}>Edit Profile Info</h3>
          <span
            onClick={handleCancelClick}
            style={{
              cursor: "pointer",
              color: "#9aa0b0",
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "#fff"}
            onMouseLeave={(e) => e.target.style.color = "#9aa0b0"}
          >
            <FaTimes />
          </span>
        </div>

        <div className="card-input-container" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: 0 }}>
          <div>
            <h5 style={{ color: "#9aa0b0", fontSize: "13px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Full Name
            </h5>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              placeholder="Full Name"
              onChange={handleInputChange}
              style={{ width: "100%", fontSize: "15px", backgroundColor: "#1e1e2d", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 12px", borderRadius: "6px", outline: "none" }}
            />
          </div>

          <div>
            <h5 style={{ color: "#9aa0b0", fontSize: "13px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              What's Your Passion
            </h5>
            <input
              type="text"
              name="jobRole"
              value={formData.jobRole}
              placeholder="Writer / Artist / Developer"
              onChange={handleInputChange}
              style={{ width: "100%", fontSize: "15px", backgroundColor: "#1e1e2d", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 12px", borderRadius: "6px", outline: "none" }}
            />
          </div>

          <div>
            <h5 style={{ color: "#9aa0b0", fontSize: "13px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Location
            </h5>
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="Location"
              onChange={handleInputChange}
              style={{ width: "100%", fontSize: "15px", backgroundColor: "#1e1e2d", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 12px", borderRadius: "6px", outline: "none" }}
            />
          </div>

          <div>
            <h5 style={{ color: "#9aa0b0", fontSize: "13px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Description / Bio
            </h5>
            <textarea
              name="description"
              value={formData.description}
              placeholder="Tell others about yourself..."
              onChange={handleInputChange}
              rows={4}
              style={{ width: "100%", fontSize: "15px", backgroundColor: "#1e1e2d", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px 12px", borderRadius: "6px", outline: "none", resize: "none", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
            <Button
              onClick={handleCancelClick}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", height: "38px", borderRadius: "6px" }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSaveButtonClick}
              style={{ backgroundColor: "#ff4f00", border: "none", color: "#fff", height: "38px", padding: "0 24px", borderRadius: "6px", fontWeight: "600" }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileCard;
