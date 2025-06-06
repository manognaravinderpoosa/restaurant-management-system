import React, { useContext, useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { NotificationContext } from "../context/NotificationContext";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead } = useContext(NotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('NotificationBell - Context values:', {
      notificationCount: notifications?.length || 0,
      unreadCount,
      hasNotifications: notifications && notifications.length > 0
    });
  }, [notifications, unreadCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Animate bell when new notification arrives
  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const toggleDropdown = () => {
    console.log('Bell clicked, toggling dropdown:', !isOpen);
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Mark as read when opening the dropdown
      setTimeout(() => {
        console.log('Marking notifications as read...');
        markAllAsRead();
      }, 500);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'stock_added': return '✅';
      case 'stock_updated': return '✏️';
      case 'stock_deleted': return '🗑️';
      case 'low_stock': return '⚠️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📦';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Debug render
  console.log('NotificationBell rendering with:', {
    unreadCount,
    notificationCount: notifications?.length || 0,
    isOpen
  });

  return (
    <div className="notification-bell-container">
      <div 
        ref={bellRef}
        className={`bell-wrapper ${isAnimating ? 'animate' : ''}`} 
        onClick={toggleDropdown}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <FaBell className="bell-icon" style={{ fontSize: '20px' }} />
        {unreadCount > 0 && (
          <span className="badge pulse" style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            minWidth: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef} 
          className="dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '350px',
            maxHeight: '400px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e1e5e9',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div className="dropdown-header" style={{
            padding: '15px 20px',
            borderBottom: '1px solid #f1f3f4',
            background: '#f8f9fa'
          }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>
              Notifications
            </h4>
            {notifications && notifications.length > 0 && (
              <span style={{
                fontSize: '12px',
                color: '#666',
                background: '#e9ecef',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {notifications.length} total
              </span>
            )}
          </div>
          
          <div className="dropdown-content" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {!notifications || notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.5 }}>🔕</div>
                <p style={{ margin: '10px 0 5px 0', fontWeight: '500' }}>No notifications yet</p>
                <small style={{ color: '#999', fontSize: '12px' }}>Stock updates will appear here</small>
              </div>
            ) : (
              <div>
                {notifications.map((note, index) => (
                  <div 
                    key={note._id || index} 
                    className={`dropdown-item ${!note.read ? 'unread' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      padding: '12px 20px',
                      borderBottom: '1px solid #f1f3f4',
                      backgroundColor: !note.read ? '#fff3cd' : 'transparent',
                      borderLeft: !note.read ? '3px solid #ffc107' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '16px', marginRight: '10px', marginTop: '2px' }}>
                      {getNotificationIcon(note.type)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', lineHeight: '1.4', color: '#333', marginBottom: '4px' }}>
                        {note.message}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {formatTime(note.timestamp)}
                      </div>
                      {note.data?.category && (
                        <div style={{
                          fontSize: '10px',
                          color: '#888',
                          background: '#f1f3f4',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          display: 'inline-block',
                          marginTop: '2px'
                        }}>
                          Category: {note.data.category}
                        </div>
                      )}
                    </div>
                    {!note.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#007bff',
                        borderRadius: '50%',
                        marginLeft: '8px',
                        marginTop: '6px'
                      }}></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;