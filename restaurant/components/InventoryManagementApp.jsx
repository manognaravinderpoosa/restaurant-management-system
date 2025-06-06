// components/InventoryManagementApp.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "../pages/Dashboard";
import StockManagement from "../pages/StockManagement";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import StockUsageEntry from "../pages/StockUsageEntry";
import Login from "../pages/Login";
import ErrorBoundary from "./ErrorBoundary";
import { NotificationProvider } from "../context/NotificationContext";
import Navbar1 from "./Navbar1";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/inventory/login" />;
    return children;
};

const InventoryManagementApp = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
        window.location.href = "/inventory";
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    return (
        <NotificationProvider>
            <Routes>
                <Route path="login" element={<Login onLogin={handleLogin} />} />
                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <Navbar1 />
                            <div className="app-container">
                                <Sidebar onToggle={setIsSidebarCollapsed} />
                                <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
                                    <Topbar />
                                    <ErrorBoundary>
                                        <Routes>
                                            <Route path="" element={<Dashboard />} />
                                            <Route path="stock" element={<StockManagement />} />
                                            <Route path="reports" element={<Reports />} />
                                            <Route path="notifications" element={<Notifications />} />
                                            <Route path="settings" element={<Settings />} />
                                            <Route path="stock-usage" element={<StockUsageEntry />} />
                                        </Routes>
                                    </ErrorBoundary>
                                </div>
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </NotificationProvider>
    );
};

export default InventoryManagementApp;
