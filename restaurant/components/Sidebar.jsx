import React, { useState, useEffect, useContext } from "react";
import {
    FaBars,
    FaHome,
    FaBox,
    FaChartBar,
    FaBell,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import "./Sidebar.css";

const Sidebar = ({ onToggle }) => {
    const [isCollapsed, setIsCollapsed] = useState(
        localStorage.getItem("sidebarCollapsed") === "true"
    );
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { unreadCount } = useContext(NotificationContext);

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", isCollapsed);
        onToggle(isCollapsed);
    }, [isCollapsed, onToggle]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
    };

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                <FaBars />
            </button>
            <ul>
                <li><Link to="/inventory/"><FaHome /> <span>Dashboard</span></Link></li>
                <li><Link to="/inventory/stock"><FaBox /> <span>Stock Management</span></Link></li>
                <li><Link to="/inventory/reports"><FaChartBar /> <span>Reports</span></Link></li>
                <li><Link to="/inventory/stock-usage"><FaBox /> <span>Stock Usage Entry</span></Link></li>
                <li>
                    <Link to="/inventory/notifications">
                        <div className="notification-icon-container">
                            <FaBell />
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <span className="notification-badge">{unreadCount}</span>
                            )}
                        </div>
                    </Link>
                </li>
                <li className="settings-dropdown">
                    <div
                        className="settings-toggle"
                        onClick={() => setSettingsOpen(!settingsOpen)}
                    >
                        <FaCog /> <span>Settings</span>
                    </div>
                    {settingsOpen && (
                        <ul className="dropdown-menu">
                            <li onClick={handleLogout}>
                                <FaSignOutAlt /> <span>Logout</span>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;