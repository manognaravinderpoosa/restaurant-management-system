import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import API_URL from '../config.js';

export const NotificationContext = createContext();

const socket = io(API_URL); // ✅ Using API_URL instead of localhost

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socket.on("notification", (message) => {
      const newNotification = {
        message,
        timestamp: new Date().toISOString()
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};