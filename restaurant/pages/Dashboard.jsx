import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import StockUsageChart from "../components/StockUsageChart";
import StockOverview from "../components/StockOverview";
import "./Dashboard.css";
import { RxDashboard } from "react-icons/rx";
import API_URL from '../config.js';

const socket = socketIOClient(API_URL); // ✅ Using API_URL instead of localhost

const Dashboard = () => {
  const [totalStock, setTotalStock] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [stockUsage, setStockUsage] = useState(0);
  const [orders, setOrders] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/dashboard`);
      setTotalStock(data.totalStock);
      setLowStock(data.lowStockCount);
      setStockUsage(data.stockUsage || 0);
      setOrders(data.orders);
      setCustomers(data.customers);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  const fetchChartData = async () => {
    try {
      await axios.get(`${API_URL}/api/dashboard/usage-chart`);
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchChartData();

    socket.on("stockAdded", fetchDashboardData);
    socket.on("stockUpdated", fetchDashboardData);
    socket.on("stockDeleted", fetchDashboardData);
    socket.on("stockUsageUpdated", fetchDashboardData);

    return () => {
      socket.off("stockAdded");
      socket.off("stockUpdated");
      socket.off("stockDeleted");
      socket.off("stockUsageUpdated");
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="dashboard">
      <button className="toggle-theme" onClick={toggleTheme}>
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="dashboard-header" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
         <h2> <RxDashboard />   Inventory Dashboard</h2>
      </div>

      <div className="cards">
        <div className="card total">
          <h4>Total Stock</h4>
          <p>{totalStock}</p>
        </div>
        <div className="card low">
          <h4>Low Stock</h4>
          <p>{lowStock}</p>
        </div>
        <div className="card usage">
          <h4>Stock Usage</h4>
          <p>{stockUsage}</p>
        </div>
       </div>

       <div className="chart-container">
        <StockUsageChart />
        <StockOverview />
       </div>
    </div>
  );
};

export default Dashboard;