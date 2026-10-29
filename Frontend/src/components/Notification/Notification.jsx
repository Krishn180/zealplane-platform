import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NotificationPage.scss";
import Header from "../header/Header";
import axiosInstance from "../../Auth/Axios";
import avatar from "../../assets/avatar.png";
import { FiCheckSquare, FiTrash2 } from "react-icons/fi";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setError("Please login to view notifications");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axiosInstance.get(`${apiBaseUrl}/notification`, { headers });
      setNotifications(res.data);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [location]);

  // Mark notification read and navigate
  const handleNotificationClick = async (notificationId, projectId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Mark as read in backend
      await axiosInstance.patch(
        `${apiBaseUrl}/notification/${notificationId}/read`,
        {},
        { headers }
      );

      // Update state locally
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification read:", err);
    }

    if (projectId) {
      navigate(`/details/${projectId}`);
    }
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    if (unreadCount === 0) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axiosInstance.patch(
        `${apiBaseUrl}/notification/read-all`,
        {},
        { headers }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    if (!window.confirm("Are you sure you want to delete all notifications?")) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axiosInstance.delete(
        `${apiBaseUrl}/notification/clear-all`,
        { headers }
      );

      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  return (
    <div className="notification-page">
      <Header />

      <main className="notification-list-container">
        <div className="notification-header">
          <h1>Notifications</h1>
          {notifications.length > 0 && (
            <div className="notification-actions">
              <button 
                onClick={handleMarkAllRead} 
                className="action-btn read-all-btn"
                disabled={notifications.every(n => n.isRead)}
              >
                <FiCheckSquare className="btn-icon" /> Mark all read
              </button>
              <button onClick={handleClearAll} className="action-btn clear-all-btn">
                <FiTrash2 className="btn-icon" /> Clear all
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="info-text">Loading notifications...</p>
        ) : error ? (
          <p className="info-text error">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="info-text">No notifications to show</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`notification-item ${!notification.isRead ? "unread" : ""}`}
                onClick={() => handleNotificationClick(notification._id, notification.projectId)}
              >
                <div className="item-left">
                  <img 
                    src={notification.sender?.profilePic || avatar} 
                    alt={notification.sender?.username || "Sender"} 
                    className="notification-avatar"
                  />
                  <div className="notification-body">
                    <p className="notification-message">{notification.message}</p>
                    <span className="timestamp">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {!notification.isRead && <span className="unread-dot" />}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
