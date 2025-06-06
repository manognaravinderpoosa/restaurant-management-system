import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./Notifications.css";

const socket = io("http://localhost:5000");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Using the correct API endpoint from your backend
      const response = await axios.get("http://localhost:5000/api/notifications");
      setNotifications(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      // Set empty array as fallback
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for new real-time notifications from your stockRoutes
    socket.on("notification", (message) => {
      const newNotification = {
        _id: Date.now().toString(),
        message: message,
        timestamp: new Date(),
        read: false,
        type: 'stock_update'
      };
      setNotifications((prev) => [newNotification, ...prev]);
    });

    // Handle dashboard updates
    socket.on("dashboardUpdate", () => {
      console.log("📊 Dashboard updated");
      // You could refresh notifications or show a toast here
    });

    return () => {
      socket.off("notification");
      socket.off("dashboardUpdate");
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      // Check if your backend has this endpoint, if not, handle locally
      try {
        await axios.put(`http://localhost:5000/api/notifications/${id}/read`);
      } catch (apiError) {
        console.log("API endpoint not available, handling locally");
      }
      
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
      setError("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      // Check if your backend has this endpoint, if not, handle locally
      try {
        await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      } catch (apiError) {
        console.log("API endpoint not available, handling locally");
      }
      
      // Remove from local state immediately
      setNotifications(prev => prev.filter(notification => notification._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      // Check if your backend has this endpoint, if not, handle locally
      try {
        await axios.put("http://localhost:5000/api/notifications/mark-all-read");
      } catch (apiError) {
        console.log("API endpoint not available, handling locally");
      }
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
      setError("Failed to mark all notifications as read");
    }
  };

  const clearAllNotifications = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      try {
        // Check if your backend has this endpoint, if not, handle locally
        try {
          await axios.delete("http://localhost:5000/api/notifications/clear-all");
        } catch (apiError) {
          console.log("API endpoint not available, handling locally");
        }
        
        setNotifications([]);
      } catch (error) {
        console.error("Error clearing all notifications:", error);
        setError("Failed to clear all notifications");
      }
    }
  };

  const getNotificationIcon = (message) => {
    if (message.includes('Added')) return '⚠️';
    if (message.includes('Updated')) return '📝';
    if (message.includes('Deleted')) return '🗑️';
    if (message.includes('Low Stock')) return '⚠️';
    return '🔔';
  };

  const getNotificationType = (message) => {
    if (message.includes('Added')) return 'success';
    if (message.includes('Updated')) return 'info';
    if (message.includes('Deleted')) return 'warning';
    if (message.includes('Low Stock')) return 'error';
    return 'info';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>
          🔔 Notifications
          {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        </h2>
      </div>

      <div className="filter-buttons">
        <button className="filter-btn all">All</button>
        {notifications.length > 0 && (
          <button className="filter-btn clear" onClick={clearAllNotifications}>
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      {loading ? (
        <div className="loading">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔕</div>
          <h3>No notifications yet!</h3>
          <p>You'll see updates about your inventory here</p>
        </div>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li 
              key={notification._id} 
              className={`note ${getNotificationType(notification.message)} ${!notification.read ? 'unread' : 'read'}`}
            >
              <div className="note-content">
                <span className="note-icon">
                  {getNotificationIcon(notification.message)}
                </span>
                <div className="note-details">
                  <div className="message">
                    {notification.message}
                  </div>
                  <div className="time">
                    {new Date(notification.timestamp || notification.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="note-actions">
                {!notification.read && (
                  <button
                    className="action-btn mark-read-btn"
                    onClick={() => markAsRead(notification._id)}
                    title="Mark as read"
                  >
                    ✓ Mark as Read
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification._id)}
                  title="Delete notification"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;